/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import users from './users.js';
import todoData from './todo.js';

run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
          INSERT INTO users (name, email, hash)
          VALUES ($1, $2, $3)
          RETURNING *;
        `,
        [user.name, user.email, user.password]);
      })
    );
    
    const user = data[0].rows[0];

    await Promise.all(
      todoData.map(todo => {
        return client.query(`
        INSERT INTO todos (task, completed, shared, user_id, user_name)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [todo.task, todo.completed, todo.shared, user.id, todo.userName]
        );}
      ));

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}