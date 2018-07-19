const authRoutes = require('./auth/index');
const secretRoutes = require('./secret/index');

module.exports = (router) => {
  authRoutes(router);
  secretRoutes(router);
  return router
}