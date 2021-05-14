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
      userId: 1,
      userName: 'Chris'
    };
    // append the token to your requests:
    //  .set('Authorization', user.token);

    it('POST todos /api/todo', async () => {

      const response = await request
        .post('/api/todos')
        .set('Authorization', user.token)
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


    it.only('GET my /api/me/todos only return my todos', async () => {

      const response = await request.get('api/me/todos')
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([todos]);
    });

    it('PUT updated todo to /api/todos/:id', async () => {

      expectedTodos.completed = true;
      const response = await request
        .put(`/api/todos/${expectedToDos.id}`)
        .set('Authorization', user.token)
        .send(expectedToDos);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedToDos);
    })

  });
});