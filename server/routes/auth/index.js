const { tokenVerificationMiddleWare } = require('../../helpers/auth')
const authControllers = require('../../controllers/auth');

module.exports = (router) => {
  router.post('/signup', authControllers.signup)
  router.post('/login', authControllers.login)
  router.get('/me', tokenVerificationMiddleWare, authControllers.me);
  return router;
}