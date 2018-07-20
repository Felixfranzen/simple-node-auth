const storage = require('../../storage/index');
const { error_messages } = require('../../storage/constants');


describe('Storage - save user', () => {

  test('should resolve when correct params are supplied', async () => {
    return expect(storage.saveUser('testname','testpass')).resolves.not.toBeUndefined();
  });

  test('should prevent missing parameters when creating a user', async () => {
    return storage.saveUser('','').catch((e) => {
      expect(e).toEqual(error_messages.missing_parameters);
    })
  });

  test('should prevent users with duplicate usernames from being added', async () => {
    await storage.saveUser('testname','testpass');
    return storage.saveUser('testname','testpass').catch((e) => {
      expect(e).toEqual(error_messages.user_already_exists);
    })
  });

});

describe('Storage - get user', () => {

  beforeEach(async () => {
    storage.clearDB()
    await storage.saveUser('testname', 'testpass')
  })

  test('should reject (missing_parameters) when parameters are missing', async () => {
    return storage.getUser('','').catch((e) => {
      expect(e).toEqual(error_messages.missing_parameters);
    })
  });

  test('should reject (user_not_found) when a user that does not exist is requested', async () => {
    return storage.getUser('missingname','password').catch((e) => {
      expect(e).toEqual(error_messages.user_not_found);
    })
  });


  test('should reject (invalid_password) when a user is requested with an invalid passwords', async () => {
    return storage.getUser('testname','invalid_pass').catch((e) => {
      expect(e).toEqual(error_messages.invalid_password);
    })
  });

  test('should omitt the password when resolving a user', async () => {
    const res = await storage.getUser('testname','testpass');
    console.log(res);
    expect(res.password).toBe('');
  });
});