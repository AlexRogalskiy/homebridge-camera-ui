/* eslint-disable unicorn/prevent-abbreviations */
'use-strict';

import * as cameraUtils from 'camera.ui/src/controller/camera/utils/camera.utils.js';

import Logger from '../../services/logger/logger.service.js';

const MAX_RECORDING_TIME = 3;
const compatibleAudio = /(aac)/;

export default class RecordingDelegate {
  constructor(api, accessory, config, cameraUi, handler) {
    this.api = api;
    this.log = Logger.log;
    this.config = config;
    this.accessory = accessory;

    this.handler = handler;
    this.cameraUi = cameraUi;

    this.configuration = {};
    this.handlingStreamingRequest = false;
    this.session = null;

    this.closeReason = null;
    this.forceCloseTimer = null;
  }

  // eslint-disable-next-line no-unused-vars
  async *handleRecordingStreamRequest(streamId) {
    this.handlingStreamingRequest = true;
    this.closeReason = null;

    this.log.debug('Video fragments requested from HSV', this.accessory.displayName);

    const videoConfig = cameraUtils.generateVideoConfig(this.accessory.context.config.videoConfig);
    let ffmpegInput = [...cameraUtils.generateInputSource(videoConfig).split(/\s+/)];

    const controller = this.cameraUi.cameraController.get(this.accessory.displayName);
    if (this.accessory.context.config.prebuffering && controller?.prebuffer) {
      try {
        this.log.debug('Setting prebuffer stream as input', this.accessory.displayName);

        const input = await controller.prebuffer.getVideo({
          container: 'mp4',
          prebuffer: this.accessory.context.config.prebufferLength,
        });

        ffmpegInput = [...input];
      } catch (error) {
        this.log.warn(`Can not access prebuffer stream, skipping: ${error}`, this.accessory.displayName, 'Homebridge');
      }
    }

    const videoArguments = [];
    const audioArguments = [];

    let acodec = videoConfig.acodec;
    let vcodec = videoConfig.vcodec;

    let audioEnabled = videoConfig.audio;
    let audioSourceFound = controller?.media.codecs.audio.length;
    let probeAudio = controller?.media.codecs.audio;
    let incompatibleAudio = audioSourceFound && !probeAudio.some((codec) => compatibleAudio.test(codec));
    //let probeTimedOut = controller?.media.codecs.timedout;

    if (!audioSourceFound) {
      this.log.debug(
        'Replacing audio with a dummy track, audio source not found or timed out during probe stream (recording)',
        this.accessory.displayName,
        'Homebridge'
      );

      ffmpegInput.push('-f', 'lavfi', '-i', 'anullsrc=cl=1', '-shortest');
      audioEnabled = true;
    }

    if (audioEnabled) {
      if (audioSourceFound) {
        if (incompatibleAudio && acodec !== 'libfdk_aac') {
          this.log.debug(
            `Incompatible audio stream detected ${probeAudio}, transcoding with "libfdk_aac"..`,
            this.accessory.displayName,
            'Homebridge'
          );
          acodec = 'libfdk_aac';
          //vcodec = vcodec === 'copy' ? 'libx264' : vcodec;
        } else if (!incompatibleAudio && !acodec) {
          this.log.debug('Compatible audio stream detected, copying..');
          acodec = 'copy';
        }
      } else {
        acodec = 'libfdk_aac';
      }

      if (acodec !== 'copy') {
        let samplerate;

        switch (this.configuration.audioCodec.samplerate) {
          case this.api.hap.AudioRecordingSamplerate.KHZ_8:
            samplerate = '8';
            break;
          case this.api.hap.AudioRecordingSamplerate.KHZ_16:
            samplerate = '16';
            break;
          case this.api.hap.AudioRecordingSamplerate.KHZ_24:
            samplerate = '24';
            break;
          case this.api.hap.AudioRecordingSamplerate.KHZ_32:
            samplerate = '32';
            break;
          case this.api.hap.AudioRecordingSamplerate.KHZ_44_1:
            samplerate = '44.1';
            break;
          case this.api.hap.AudioRecordingSamplerate.KHZ_48:
            samplerate = '48';
            break;
          default:
            throw new Error(`Unsupported audio samplerate: ${this.configuration.audioCodec.samplerate}`);
        }

        audioArguments.push(
          '-bsf:a',
          'aac_adtstoasc',
          '-acodec',
          'libfdk_aac',
          ...(this.configuration.audioCodec.type === this.api.hap.AudioRecordingCodecType.AAC_LC
            ? ['-profile:a', 'aac_low']
            : ['-profile:a', 'aac_eld']),
          '-ar',
          `${samplerate}k`,
          '-b:a',
          `${this.configuration.audioCodec.bitrate}k`,
          '-ac',
          `${this.configuration.audioCodec.audioChannels}`
        );
      } else {
        vcodec = 'copy';
        audioArguments.push('-bsf:a', 'aac_adtstoasc', '-acodec', 'copy');
      }
    } else {
      audioArguments.push('-an');
    }

    const profile =
      this.configuration.videoCodec.profile === this.api.hap.H264Profile.HIGH
        ? 'high'
        : this.configuration.videoCodec.profile === this.api.hap.H264Profile.MAIN
        ? 'main'
        : 'baseline';

    const level =
      this.configuration.videoCodec.level === this.api.hap.H264Level.LEVEL4_0
        ? '4.0'
        : this.configuration.videoCodec.level === this.api.hap.H264Level.LEVEL3_2
        ? '3.2'
        : '3.1';

    const width = this.configuration.videoCodec.resolution[0];
    const height = this.configuration.videoCodec.resolution[1];
    //const fps = this.configuration.videoCodec.resolution[2];
    const videoBitrate = this.configuration.videoCodec.parameters.bitRate;
    const iFrameInterval = this.configuration.videoCodec.parameters.iFrameInterval;

    if (vcodec === 'copy') {
      videoArguments.push('-vcodec', 'copy');
    } else {
      videoArguments.push(
        //'-an',
        '-sn',
        '-dn',
        '-vcodec',
        vcodec,
        '-pix_fmt',
        'yuv420p',
        '-profile:v',
        profile,
        '-level:v',
        level,
        '-b:v',
        `${videoBitrate}k`,
        //'-r',
        //fps.toString(),
        '-vf',
        //It looks like if FPS is fixed at 25 instead of 30, it reduces the probability of HSV breaking.
        `framerate=fps=25,scale=w=${width}:h=${height}:force_original_aspect_ratio=1,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
        '-force_key_frames',
        `expr:gte(t,n_forced*${iFrameInterval / 1000})`
      );
    }

    this.session = await cameraUtils.startFFMPegFragmetedMP4Session(
      this.accessory.displayName,
      videoConfig.debug,
      this.config.options.videoProcessor,
      ffmpegInput,
      audioArguments,
      videoArguments
    );

    this.log.debug('Recording started', this.accessory.displayName);

    const timer =
      (await this.cameraUi?.database?.interface.chain
        .get('settings')
        .get('cameras')
        .find({ name: this.accessory.displayName })
        .value()) || MAX_RECORDING_TIME;

    if (timer > 0) {
      this.forceCloseTimer = setTimeout(() => {
        this.log.warn(
          `The recording process has been running for ${timer} minutes and is now being forced closed!`,
          this.accessory.displayName
        );

        this.accessory
          .getService(this.api.hap.Service.MotionSensor)
          .getCharacteristic(this.api.hap.Characteristic.MotionDetected)
          .updateValue(false);
      }, timer * 60 * 1000);
    }

    let pending = [];
    let filebuffer = Buffer.alloc(0);

    try {
      for await (const box of this.session.generator) {
        const { header, type, data } = box;

        pending.push(header, data);

        const motionDetected = this.accessory
          .getService(this.api.hap.Service.MotionSensor)
          .getCharacteristic(this.api.hap.Characteristic.MotionDetected).value;

        if (type === 'moov' || type === 'mdat') {
          const fragment = Buffer.concat(pending);

          filebuffer = Buffer.concat([filebuffer, Buffer.concat(pending)]);
          pending = [];

          yield {
            data: fragment,
            isLast: !motionDetected,
          };

          if (!motionDetected) {
            this.log.debug('Ending recording session due to motion stopped!', this.accessory.displayName);
            break;
          }
        }
      }
    } catch (error) {
      if (!error.message?.startsWith('FFMPEG')) {
        this.log.info('Encountered unexpected error on generator');
        this.log.error(error);
      } else {
        this.log.debug(error.message || error, this.accessory.displayName);
      }
    } finally {
      if (this.closeReason && this.closeReason !== this.api.hap.HDSProtocolSpecificErrorReason.NORMAL) {
        this.log.warn(
          `The recording process was aborted by HSV with reason "${
            this.api.hap.HDSProtocolSpecificErrorReason[this.closeReason]
          }"`,
          this.accessory.displayName,
          'Homebridge'
        );
      } else if (filebuffer.length > 0) {
        this.log.debug('Recording completed (HSV)', this.accessory.displayName);
        this.cameraUi.eventController.triggerEvent('custom', this.accessory.displayName, true, filebuffer, 'Video');
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  updateRecordingActive(active) {
    //this.log.debug(`Recording: ${active}`, this.accessory.displayName);
  }

  updateRecordingConfiguration(configuration) {
    //this.log.debug(`Updating recording configuration: ${JSON.stringify(configuration)}`, this.accessory.displayName);
    this.configuration = configuration;
  }

  async closeRecordingStream(streamId, reason) {
    this.log.info('Closing recording process', this.accessory.displayName);

    if (this.session) {
      this.session.socket?.destroy();
      this.session.cp?.kill('SIGKILL');
      this.session = undefined;
    }

    if (this.forceCloseTimer) {
      clearTimeout(this.forceCloseTimer);
      this.forceCloseTimer = null;
    }

    const motionState = this.accessory
      .getService(this.api.hap.Service.MotionSensor)
      .getCharacteristic(this.api.hap.Characteristic.MotionDetected).value;

    if (motionState) {
      // If HSV interrupts the recording with an error,
      // the process is restarted because the motion sensor still indicates motion.
      // Most likely, this is due to an incorrect camera configuration.
      // To avoid a restart loop, the motion sensor is reset.
      this.log.debug('Resetting motion sensor, because HSV closed the recording process', this.accessory.displayName);
      await this.handler.motionHandler(this.accessory, false);
    }

    this.closeReason = reason;
    this.handlingStreamingRequest = false;
  }

  acknowledgeStream(streamId) {
    this.closeRecordingStream(streamId);
  }
}
