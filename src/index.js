const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);
  request.user = user;
  return (
    user
    ? next()
    : response.status(404).json({
      error: 'Usuario n existente'
    }).send()
  );
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const id = uuidv4();
  const user = {
    id,
    name,
    username,
    todos: [],
  };
  if (users.some((user) => user.username === username))
    return response.status(400).json({
      error: "Usuario ja existente!"
    }).send()
  users.push(user);
  return response.status(201).json(user).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  
  return (response.json(user.todos)); 
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const id = uuidv4();
  const todo = {
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  user.todos.push(todo);
  return response.status(201).json(todo).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todo = user.todos.find((todo) => todo.id === id);
  if (todo) {
    todo.title = title;
    todo.deadline = new Date(deadline);
  }

  return (
    todo
    ? response.json(todo).send() 
    : response.status(404).json({ error: 'Id de todo invalido!'})
  );
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);
  if (todo)
    todo.done = true;

  return (
    todo
    ? response.json(todo).send()
    : response.status(404).json({ error: 'Id de todo inexistente!'}).send()
  );
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);
  if (todo)
    user.todos.splice(user.todos.indexOf(todo), user.todos);

  return (
    todo
    ? response.status(204).send()
    : response.status(404).json({ error: 'Id de todo inexistente' }).send()
  );
});

module.exports = app;