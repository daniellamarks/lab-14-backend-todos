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
      console.log(user)
    });


    let expectedToDos = {
      id: expect.any(Number),
      task: 'wash the dishes',
      completed: false,
      shared: false,
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

      //this line is for post requests
      expectedToDos = response.body;
      

    });


    it('GET my /api/me/todos only return my todos', async () => {
      console.log(expectedToDos);
      const response = await request
      //fetching what is displayed on the front end
        .get('/api/me/todos')
        //token is what gets returned after you sign up/sign in
        .set('Authorization', user.token);

      // expectedTodos = response.body;

      expect(response.status).toBe(200);
      expect(response.body).toEqual([expectedToDos]);

      
    });


    it('PUT updated todo to /api/todos/:id', async () => {

      expectedToDos.completed = true;

      const response = await request
        .put(`/api/todos/${expectedToDos.id}`)
        .set('Authorization', user.token)
        .send(expectedToDos);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedToDos);
    });

  });
});