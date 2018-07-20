const request = require('supertest');
const app = require('../../app.js');
const  {generateToken } = require('../../helpers/auth')

describe('Token verification', () => {

  test('should restrict access to secret route without token', async () => {
    const res = await request(app).get('/api/data')
    expect(res.status).toBe(401)
  })

  test('should enable access to secret route with token', async () => {
    // should use a mock user
    const token = generateToken()
    const res = await request(app).get('/api/data')
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200)
  })
})