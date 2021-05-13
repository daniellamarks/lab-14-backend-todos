import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/todo', () => {
    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Me the User',
          email: 'me@user.com',
          password: 'password'
        });

      expect(response.status).toBe(200);

      user = response.body;
    });


    let expectedToDos = {
      id: expect.any(Number),
      task: 'wash the dishes',
      completed: false,
      shared: false,
      userId: 4,
      userName: 'Chris'
    }
    // append the token to your requests:
    //  .set('Authorization', user.token);

    it('POST todo /api/todo', async () => {

      const response = await request
        .post('/api/todo')
        .set('Authorization, user.token')
        .send(expectedToDos);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        userId: user.id,
        ...expectedToDos
      });


      expectedToDos = response.body;
      // expect(response.status).toBe(200);
      // expect(response.body).toEqual(?);
    });

  });
});