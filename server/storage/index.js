const bcrypt = require('bcryptjs')
const uuidv4 = require('uuid/v4');

const { error_messages } = require('./constants');

let USERS = []

const saveUser = (username, password) => {
  return new Promise((resolve, reject) => {
    if (!username || !password){
      reject(error_messages.missing_parameters);
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const id = uuidv4();
    USERS.push({
      username,
      id,
      password: hashedPassword,
    });

    resolve({ username, id });
  });
}

const getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    if (!username || !password){
      reject(error_messages.missing_parameters);
    }

    const user = USERS.find((user) => {
      return (user.username === username);
    });

    if (!user){
      reject(error_messages.user_not_found);
    }

    const hasValidPassword = bcrypt.compareSync(password, user.password);
    if (hasValidPassword){
      resolve({ ...user, password: '' });
    } else {
      reject(error_messages.invalid_password);
    }
  })
}

const clearDB = () => {
  USERS = []
}

module.exports = {
  getUser,
  saveUser,
  clearDB
}