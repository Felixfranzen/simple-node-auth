const request = require('supertest');
const app = require('../../app.js');
const  {generateToken } = require('../../helpers/auth')

const testUsername = 'username'
const testPassword = 'password'

describe('Authentication - Signup', () => {

  test('should respond with 400 if no username or pass is provdided in the body', async () => {
    const res = await request(app).post('/auth/signup');
    expect(res.status).toBe(400);
  })

  test('should respond with 200 and a token if a valid username and pass are provided', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: testUsername,
        password: testPassword
      });

    expect(res.status).toBe(200);
    expect(res.body.token).not.toBeUndefined();
  })
})

describe('Authentication - Login', () => {

  test('should respond with 400 when a login request lacks both username and pass in body', async () => {
    const res = await request(app).post('/auth/login');
    expect(res.status).toBe(400);
  })

  test('should send 400 if no username is provided', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ password: testPassword });

    expect(res.status).toBe(400);
  })

  test('should send 400 if no password is provided', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: testUsername });

    expect(res.status).toBe(400);
  })

  test('should send 401 if username and pass are invalid', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'invalid_username',
        password: 'invalid_password'
      });

    expect(res.status).toBe(401);
  })

  test('should respond with 200 if username and pass are correct', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: testUsername,
        password: testPassword
      });

    expect(res.status).toBe(200);
    expect(res.body.token).not.toBeUndefined();
  })
})


describe('Authentication - Me', () => {

  test('should respond with 401 of a valid token is missing', async () => {
    const res = await request(app).get('/auth/me')
    expect(res.status).toBe(401);
  });

  test('should respond with 200 and information about the user if a valid token is provided', async () => {
    const signupResponse = await request(app)
      .post('/auth/signup')
      .send({
        username: testUsername,
        password: testPassword
      });

    const res = await request(app).get('/auth/me')
      .set('Authorization', 'Bearer ' + signupResponse.body.token);

    expect(res.status).toBe(200);
    expect(res.body.id).not.toBeUndefined();
  });

});