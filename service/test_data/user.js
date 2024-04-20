const { api, postApi } = require('./fetchApi');

const users = ['Alice', 'Bob', 'Cathy', 'Danny', 'Eric', 'Yvonne'];

const createUsers = async () => {
  users.forEach((user) => {
    postApi(`${api}/auth/signup`, {
      username: user,
      password: 'password',
    });
  });
};

createUsers();
