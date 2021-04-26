const app = require('../../server/app');
const config = require('../../services/config/config.service.js');
const lowdb = require('../../server/services/lowdb.service');

const supertest = require('supertest');
const request = supertest(app);

let notificationId;

const camera = {
  name: 'Test Camera',
  videoConfig: {
    source: 'test',
  },
};

const masterCredentials = {
  name: 'master',
  password: 'master',
};

beforeAll(async () => {
  await lowdb.ensureDatabase();
  await lowdb.resetDatabase();
  await lowdb.prepareDatabase(config.plugin);
  lowdb.initTokensDatabase();

  const database = await lowdb.database();

  let cameraExist = await database.get('cameras').find({ name: 'Test Camera' }).value();

  if (!cameraExist) {
    await database.get('cameras').push(camera).write();
  }
});

describe('GET /api/notifications', () => {
  it('should response with JSON array of all registered notifications', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request.get('/api/notifications').auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body.result)).toBe(true);
  });
});

describe('POST /api/notifications', () => {
  it('should fail if a required field is missing', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const notification = {
      //camera: 'Test Camera',
      recordType: 'Snapshot',
      trigger: 'motion',
    };

    const response = await request
      .post('/api/notifications')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send(notification);
    expect(response.statusCode).toEqual(422);
  });

  it('should create a new notification', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const notification = {
      camera: 'Test Camera',
      type: 'Snapshot',
      trigger: 'motion',
    };

    const response = await request
      .post('/api/notifications')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send(notification);
    expect(response.statusCode).toEqual(201);

    notificationId = response.body.id;
  });
});

describe('GET /api/notifications/:id', () => {
  it('should fail if notification dont exists', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request.get('/api/notifications/1337').auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(404);
  });

  it('should response with JSON object of the notification', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request
      .get('/api/notifications/' + notificationId)
      .auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(200);
    expect(Object.keys(response.body).length).toBeTruthy();
  });
});

describe('DELETE /api/notifications/:id', () => {
  it('should fail if notification dont exists', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request.delete('/api/notifications/1337').auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(404);
  });

  it('should response with no content if successfull', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request
      .delete('/api/notifications/' + notificationId)
      .auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(204);
  });
});

describe('DELETE /api/notifications', () => {
  it('should response with no content if successfull', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request.delete('/api/notifications').auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(204);
  });
});
