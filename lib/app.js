/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
import ensureAuth from './auth/ensure-auth.js';
import createAuthRoutes from './auth/create-auth-routes.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /api/auth/signin and a /api/auth/signup POST route. 
// each requires a POST body with a .email and a .password and .name
app.use('/api/auth', authRoutes);

// heartbeat route
app.get('/', (req, res) => {
  res.send('todos API');
});

// everything that starts with "/api" below here requires an auth token!
// In theory, you could move "public" routes above this line
app.use('/api', ensureAuth);

// API routes:

app.get('/api/me/todos', async (req, res) => {
  // use SQL query to get data...

  try {
    const data = await client.query(`
      SELECT  id, task, completed, shared, user_id as "userId", user_name as "userName"
      FROM    todos
      WHERE user_id = $1;
    `, [req.userId]);
    console.log(data.rows)
    // send back the data
    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/todos', async (req, res) => {

  try {
    const todo = req.body;

    const data = await client.query(` 
    INSERT INTO todos (task, completed, shared, user_id, user_name)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, task, completed, shared, user_id as "userId", user_name as "userName";
    `, [
      todo.task, todo.completed, todo.shared, req.userId, todo.userName
    ]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const todo = req.body;
    // console.log(req.body)
    const data = await client.query(`
      
    `, [todo.task, todo.completed, todo.shared, req.userId, todo.userName]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;