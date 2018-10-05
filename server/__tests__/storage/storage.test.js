const storage = require('../../storage/index');
const { error_messages } = require('../../storage/constants');
const sqlInstance = require('../../storage/db').instance;

const clearUserTable = async () => {
  await sqlInstance.query('DROP TABLE USERS;');
  let queryString = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
        username VARCHAR(255) NOT NUll UNIQUE,
        password VARCHAR(255) NOT NUll
      );`;
  await sqlInstance.query(queryString);
}

describe('Storage - save user', () => {

  beforeAll(async () => {
    await sqlInstance.start();
  });

  beforeEach(async () => {
    await clearUserTable();
  });

  test('should resolve when correct params are supplied', async () => {
    const res = await storage.saveUser(sqlInstance, 'testname', 'testpass');
    expect(res).not.toBeUndefined();
  });

  test('should prevent missing parameters when creating a user', async () => {
    return storage.saveUser(sqlInstance, '', '').catch((e) => {
      expect(e).toEqual(error_messages.missing_parameters);
    })
  });

  test('should prevent users with duplicate usernames from being added', async () => {
    await storage.saveUser(sqlInstance, 'testname', 'testpass');
    return storage.saveUser(sqlInstance, 'testname','testpass').catch((e) => {
      expect(e).toEqual(error_messages.user_already_exists);
    })
  });

});

describe('Storage - get user', () => {

  beforeAll(async () => {
    await sqlInstance.start();
  });

  beforeEach(async () => {
    await clearUserTable();
    await storage.saveUser(sqlInstance, 'testname', 'testpass')
  })

  test('should reject (missing_parameters) when parameters are missing', async () => {
    return storage.getUser(sqlInstance, '','').catch((e) => {
      expect(e).toEqual(error_messages.missing_parameters);
    })
  });

  test('should reject (user_not_found) when a user that does not exist is requested', async () => {
    return storage.getUser(sqlInstance, 'missingname', 'password').catch((e) => {
      expect(e).toEqual(error_messages.user_not_found);
    })
  });


  test('should reject (invalid_password) when a user is requested with an invalid passwords', async () => {
    return storage.getUser(sqlInstance, 'testname', 'invalid_pass').catch((e) => {
      expect(e).toEqual(error_messages.invalid_password);
    })
  });

  test('should omitt the password when resolving a user', async () => {
    const res = await storage.getUser(sqlInstance, 'testname', 'testpass');
    expect(res.password).toBeUndefined();
  });
});