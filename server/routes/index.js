const authRoutes = require('./auth/index');
const secretRoutes = require('./secret/index');

module.exports = (router) => {
  //public
  authRoutes(router);
  secretRoutes(router);
}