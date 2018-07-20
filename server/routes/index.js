const authRoutes = require('./auth/index');
const secretRoutes = require('./secret/index');
const { tokenVerificationMiddleWare } = require('../helpers/auth')


module.exports = (express) => {
  const rootRouter = express.Router();

  rootRouter.use('/auth', authRoutes(express.Router()));
  rootRouter.use('/api', tokenVerificationMiddleWare, secretRoutes(express.Router()));

  return rootRouter;
}