const request = require('supertest');
const app = require('../../app.js');
const  {generateToken } = require('../../helpers/auth')

describe('Authentication - Signup', () => {

  test('should respond with 400 if no username or pass is provdided in the body', async () => {
    const res = await request(app).post('/api/signup');
    expect(res.status).toBe(400);
  })

  test('should respond with 200 and a token if a valid username and pass are provided', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({
        username: 'tjosan',
        password: 'password'
      });

    expect(res.status).toBe(200);
    expect(res.body.token).not.toBeUndefined();
  })
})

describe('Authentication - Login', () => {

  test('should respond with 400 when a login request lacks both username and pass in body', async () => {
    const res = await request(app).post('/api/login');
    expect(res.status).toBe(400);
  })

  test('should send 400 if no username is provided', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ password: 'pass' });

    expect(res.status).toBe(400);
  })

  test('should send 400 if no password is provided', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'tjosan' });

    expect(res.status).toBe(400);
  })

  test('should send 401 if username and pass are invalid', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'invalid_username',
        password: 'invalid_password'
      });

    expect(res.status).toBe(401);
  })

  test('should respond with 200 if username and pass are correct', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'tjosan',
        password: 'password'
      });

    expect(res.status).toBe(200);
  })
})

describe('Authentication - Restricted routes', () => {

  test('should restrict access to secret route without token', async () => {
    const res = await request(app).get('/api/data')
    expect(res.status).toBe(401)
  })

  test('should enable access to secret route with token', async () => {
    const token = generateToken()
    const res = await request(app).get('/api/data')
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200)
  })
})