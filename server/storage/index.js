const bcrypt = require('bcryptjs')
const { error_messages } = require('./constants');

let ID = 0;
let USERS = []

const saveUser = (username, password) => {
  return new Promise((resolve, reject) => {
    if (!username || !password){
      reject(error_messages.missing_parameters);
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    ID = ID + 1;
    const userId = ID;
    USERS.push({
      username,
      password: hashedPassword,
      id: ID
    });

    resolve(userId);
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
      //remove pass
      resolve(user);
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