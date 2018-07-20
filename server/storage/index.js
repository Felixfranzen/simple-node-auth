const bcrypt = require('bcryptjs')

let ID = 0;
const USERS = []

const saveUser = (username, password) => {
  return new Promise((resolve, reject) => {
    if (!username || !password){
      reject();
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
    const user = USERS.find((user) => {
      return (user.username === username);
    });

    if (!user){
      reject();
    }

    const hasValidPassword = bcrypt.compareSync(password, user.password);
    if (hasValidPassword){
      //remove pass
      resolve(user);
    } else {
      reject();
    }
  })
}

module.exports = {
  getUser,
  saveUser
}