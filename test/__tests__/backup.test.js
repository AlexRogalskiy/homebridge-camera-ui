const app = require('../../server/app');
const config = require('../../services/config/config.service.js');
const lowdb = require('../../server/services/lowdb.service');

const fs = require('fs-extra');
const path = require('path');
const supertest = require('supertest');
const request = supertest(app);

const masterCredentials = {
  name: 'master',
  password: 'master',
};

beforeAll(async () => {
  await lowdb.ensureDatabase();
  await lowdb.resetDatabase();
  await lowdb.prepareDatabase(config.plugin);
  await lowdb.refreshRecordingsDatabase();
  lowdb.initTokensDatabase();

  const recordingsDatabase = lowdb.recordingsDatabase();

  recordingsDatabase
    .get('recordings')
    .remove(() => true)
    .write(); // eslint-disable-line no-unused-vars

  let recPath = recordingsDatabase.get('path').value();
  await fs.emptyDir(recPath);

  let files = [
    'Yi_Dome-48171187ca-1616771136_m_CUI.mp4',
    'Yi_Dome-48171187ca-1616771136_m@2_CUI.jpeg',
    'Yi_Dome-c45647fbdf-1619771202_m_CUI.jpeg',
  ];

  for (const file of files) {
    await fs.ensureFile(recPath + '/' + file);
  }
});

describe('GET /api/backup/download', () => {
  // eslint-disable-next-line jest/no-done-callback
  it('should response if successfull', async (done) => {
    const backupFileName = 'cameraui-backup.tar.gz';
    const backupDirectory = path.resolve(__dirname, '..', 'storage');
    const backupPath = path.resolve(backupDirectory, backupFileName);

    const file = fs.createWriteStream(backupPath);

    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    await request
      .get('/api/backup/download')
      .auth(auth.body.access_token, { type: 'bearer' })
      .expect(200)
      .pipe(file)
      .on('finish', () => done());
  });
});

describe('POST /api/backup/restore', () => {
  it('should response if successfull', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    //restore from created backup file
    const backupFileName = 'cameraui-backup.tar.gz';
    const backupDirectory = path.resolve(__dirname, '..', 'storage');
    const backupPath = path.resolve(backupDirectory, backupFileName);

    const response = await request
      .post('/api/backup/restore')
      .auth(auth.body.access_token, { type: 'bearer' })
      .field('name', backupFileName)
      .attach('file', backupPath);

    expect(response.statusCode).toEqual(201);
  });
});
