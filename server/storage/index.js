const bcrypt = require('bcryptjs')
const uuidv4 = require('uuid/v4');

const { error_messages } = require('./constants');

const saveUser = (sql, username, password) => {
  return new Promise(async (resolve, reject) => {
    if (!username || !password){
      reject(error_messages.missing_parameters);
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const id = uuidv4();

    try {
      const query = await sql.query('INSERT INTO users (id, username, password) VALUES (?, ? ,?)', [id, username, hashedPassword]);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        reject(error_messages.user_already_exists);
      } else {
        reject(error_messages.general);
      }
    }

    resolve({ username, id });
  });
}

const getUser = (sql, username, password) => {
  return new Promise(async (resolve, reject) => {
    if (!username || !password){
      reject(error_messages.missing_parameters);
      return;
    }

    const query = await sql.query('SELECT * FROM users WHERE username = ?', username);
    const user = query.results[0];

    if (!user){
      reject(error_messages.user_not_found);
      return;
    }

    const hasValidPassword = bcrypt.compareSync(password, user.password);
    if (hasValidPassword){
      resolve({
        id: user.id,
        username: user.username
      });
    } else {
      reject(error_messages.invalid_password);
    }
  })
}

module.exports = {
  getUser,
  saveUser
}