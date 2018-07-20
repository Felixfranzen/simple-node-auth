const { tokenVerificationMiddleWare } = require('../../helpers/auth')

module.exports = (router) => {
  router.get('/data', (req, res) => {
    res.json({ data: 'super secret data here!' })
  });

  return router;
}