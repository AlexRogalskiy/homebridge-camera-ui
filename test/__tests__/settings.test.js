const app = require('../../server/app');
const config = require('../../services/config/config.service.js');
const lowdb = require('../../server/services/lowdb.service');

const supertest = require('supertest');
const request = supertest(app);

const masterCredentials = {
  username: 'master',
  password: 'master',
};

beforeAll(async () => {
  await lowdb.ensureDatabase();
  await lowdb.resetDatabase();
  await lowdb.prepareDatabase(config.plugin);
});

describe('GET /api/settings', () => {
  it('should response with JSON object', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request.get('/api/settings').auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(200);
    expect(Object.keys(response.body).length).toBeTruthy();
  });
});

describe('GET /api/settings/:target', () => {
  it('should fail if target not found', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request.get('/api/settings/lulz').auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(404);
  });

  it('should response with JSON object of target', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request.get('/api/settings/general').auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(200);
    expect(Object.keys(response.body).length).toBeTruthy();
  });
});

describe('PATCH /api/settings/:target', () => {
  it('should fail if target not found', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request
      .patch('/api/settings/lulz')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({ atHome: true });
    expect(response.statusCode).toEqual(404);
  });

  it('should fail if body is undefined', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request.patch('/api/settings/general').auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(400);
  });

  it('should response if target updated successfully', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request
      .patch('/api/settings/general')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({ atHome: true });
    expect(response.statusCode).toEqual(204);
  });
});

describe('PUT /api/settings', () => {
  it('should response if db has been successfully resetted', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request.put('/api/settings/reset').auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(204);
  });
});
