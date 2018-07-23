const mysql = require('mysql');
const config = require('../config.json');

/*
config.json requires the following properties to be valid
{
  db: {
    host: '',
    user: '',
    password: '',
    database: ''
  }
}
*/


class SQL {
  constructor(config){
      this._config = { ...config, multipleStatements: true };
  }

  async start() {
    return new Promise(async (resolve, reject) => {
      try {
        this._pool = mysql.createPool(this._config);

        let queryString = `
        CREATE TABLE IF NOT EXISTS users (
          id CHAR(32) PRIMARY KEY,
          username VARCHAR(255) NOT NUll,
          password VARCHAR(255) NOT NUll
        );`;

        await this.query(queryString);

      } catch (e) {
        reject(e)
      }
      resolve();
    });
  }

  async query(queryString, params){
    if (!this._pool){
      await start();
    }

    return new Promise((resolve, reject) => {
      let connection = this._pool.getConnection((err, connection) => {
        if (err) reject(err);

        connection.query(queryString, params, (error, results, fields) => {
          connection.release();
          if (error) reject(error);

          resolve({
            results,
            fields
          });

        })
      });
    })
  }
}

let instance  = new SQL(config.db);
instance.start().catch((e) => {
  console.log(e);
  process.exit();
})

module.exports = {
  middleware: (req, res, next) => {
    req.sql = instance;
    next();
  }
};