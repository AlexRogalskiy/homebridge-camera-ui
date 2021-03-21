'use strict';

const Logger = require('../../lib/logger.js');

const socket = require('../server/socket');

module.exports = (db) => {

  function get(){
    
    let notifications = db.get('notifications').value();
    
    return notifications;
    
  }
  
  function getNots(){
    
    let nots = db.get('notifications').get('nots').orderBy('timestamp', ['desc']).value();
    
    return nots;
    
  }
  
  function getNotification(id){
    
    let notification = db.get('notifications').get('nots').find({ id: id }).value();
    
    return notification;
    
  }
  
  function getLastFive(camera){
  
    let lastFive;
  
    if(camera){
    
      lastFive = db.get('notifications').get('lastFive').get(camera).orderBy('timestamp', ['desc']).value();
    
    } else {
    
      lastFive = db.get('notifications').get('lastFive').value();
    
    }
    
    return lastFive;
    
  }
  
  function getLastNotifications(camera){
    
    let lastNotifications;
    
    if(camera){
    
      lastNotifications = db.get('notifications').get('lastNotifications').get(camera).value();
    
    } else {
    
      lastNotifications = db.get('notifications').get('lastNotifications').value();
    
    }
    
    return lastNotifications;
    
  }
  
  function add(accessory, type, time, rndm, recordNotification, detected){
  
    let room = db.get('settings').get('cameras').get(accessory.displayName).get('room').value();
    let fileType = db.get('settings').get('recordings').get('type').value();
    let hideBanner = db.get('settings').get('notifications').get('clearBanner').value();
  
    let id = accessory.displayName.replace(/\s/g,'_') + '-' + rndm + '-' + time.timestamp + '_' + (recordNotification ? '1' : '0') + '_' + (type === 'motion' ? 'm' : 'd');
  
    let notification = {
      id: id,
      name: accessory.displayName.replace(/\s+/g, ''),
      originName: accessory.displayName,
      fileName: id + (fileType === 'Snapshot' ? '.jpeg' : '.mp4'),
      type: type,
      fileType: fileType,
      room: room,
      timestamp: time.timestamp,
      time: time.time,
      storing: recordNotification,
      hideBanner: hideBanner,
      labels: detected || 'no label'
    };
    
    Logger.ui.info('Adding new notification ' + notification.id);

    db.get('notifications').get('nots').push(notification).write();
    
    updateLastNotifications(accessory, notification);
    updateLastFiveNotifications(accessory, notification);
    
    return notification;
    
  }
  
  function remove(id){
  
    Logger.ui.debug('Removing notification ' + id);
    
    let notification = getNotification(id);
    
    if(notification){
    
      db.get('notifications').get('nots').remove({ id: id }).write();
      socket.io('notification_remove', id);
    
    } else {
    
      Logger.ui.debug('Can not remove notification! Not found or already removed!');
    
    }
    
    return;
    
  }
  
  function removeAll(room){
      
    if(room.length && !room.includes('all')){
    
      Logger.ui.info('Removing all notifications for following rooms: ' + room.toString());
    
      let nots = getNots();
      
      for(const not of nots)
        if(room.includes(not.room))
          remove(not.id);
    
    } else {
    
      if(room.includes('all')){
        Logger.ui.info('Removing all notifications!');
        db.get('notifications').set('nots', []).write();
        socket.io('notification_remove', 'all');
      }
    
    }
    
    return;
    
  }
  
  function updateLastNotifications(accessory, notification){
    
    db.get('notifications').get('lastNotifications').set(accessory.displayName, notification).write();
    
    return;
    
  }
  
  function updateLastFiveNotifications(accessory, notification){
    
    let lastFive = db.get('notifications').get('lastFive').get(accessory.displayName).value();
    
    if(lastFive.length >= 5){
      
      lastFive.shift();
      lastFive.push(notification);
      
      db.get('notifications').get('lastFive').set(accessory.displayName, lastFive).write();
      
    } else {
      
      db.get('notifications').get('lastFive').get(accessory.displayName).push(notification).write();
      
    }
    
    return;
    
  }
  
  return {
    get: get,
    getNots: getNots,
    getNotification: getNotification,
    getLastFive: getLastFive,
    getLastNotifications: getLastNotifications,
    add: add,
    remove: remove,
    removeAll: removeAll
  };
  
};