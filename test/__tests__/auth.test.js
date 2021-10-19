const app = require('../../server/app');
const config = require('../../services/config/config.service.js');
const lowdb = require('../../server/services/lowdb.service');

const supertest = require('supertest');
const request = supertest(app);

let token;

const user = {
  id: 'b5d76220-986d-4d96-8612-24eab4a9e3f0',
  username: 'user',
  password:
    '5UAbVs2gQBoasU8rgwXoUA==$F/zGXi4Zxg0vhqpdTlRBJAx9mC4GhdjjCAddj+qjL2A/RWvzvCG14+o3Q/62vzBUbXz0cpG0wdjGGjaUa3QvIw==',
  photo: '/images/user/anonym.png',
  permissionLevel: ['users:access'],
};

const userCredentials = {
  username: 'user',
  password: 'test',
};

const masterCredentials = {
  username: 'master',
  password: 'master',
};

beforeAll(async () => {
  await lowdb.ensureDatabase();
  await lowdb.resetDatabase();
  await lowdb.prepareDatabase(config.plugin);

  const database = await lowdb.database();
  await database.get('users').push(user).write();
});

describe('Authentication', () => {
  it('should fail if name or password is empty', async () => {
    const auth = await request.post('/api/auth/login').send({ name: 'user' });
    expect(auth.statusCode).toEqual(422);
  });

  it('should response after successfull login with token', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);
  });

  it('should response after successfull logout', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    token = auth.body.access_token;

    const response = await request.post('/api/auth/logout').auth(token, { type: 'bearer' });
    expect(response.statusCode).toEqual(200);
  });
});

describe('Check authentication', () => {
  it('should fail if token not given', async () => {
    const response = await request.get('/api/auth/check');
    expect(response.statusCode).toEqual(401);
  });

  it('should fail if token is expired/invalid/blacklisted', async () => {
    const response = await request.get('/api/auth/check').auth(token, { type: 'bearer' });
    expect(response.statusCode).toEqual(401);
  });

  it('should response with status OK if successfull', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request.get('/api/auth/check').auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(200);
  });
});

describe('GET endpoint with a heigher permission level', () => {
  it('should require authorization', async () => {
    const response = await request.get('/api/users');
    expect(response.statusCode).toEqual(401);
  });

  it('should fail if permission level is lower than required', async () => {
    const auth = await request.post('/api/auth/login').send(userCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request.get('/api/notifications').auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(403);
  });

  it('should response if permission level is greater or equal than required', async () => {
    const auth = await request.post('/api/auth/login').send(masterCredentials);
    expect(auth.statusCode).toEqual(201);

    const response = await request.get('/api/users').auth(auth.body.access_token, { type: 'bearer' });
    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body.result)).toBe(true);
  });
});
