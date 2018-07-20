const { generateToken, decodeToken, extractTokenFromHeader, tokenVerificationMiddleWare } = require('../../helpers/auth')
const storage = require('../../storage/index')

module.exports = (router) => {
  router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password){
      res.sendStatus(400);
      return;
    }

    try {
      const userId = await storage.saveUser(username, password);
      const token = generateToken(userId)
      res.json({ token });
    } catch (e) {
      res.sendStatus(500);
    }
  })

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password){
      res.sendStatus(400);
      return;
    }

    try {
      const user = await storage.getUser(username, password);
      if (user){
        const token = generateToken()
        res.json({ token });
      } else {
        res.sendStatus(401)
      }
    } catch (e) {
      res.sendStatus(401);
    }


  })

  router.get('/me', tokenVerificationMiddleWare, async (req,res) => {
    try {
      const decoded = await decodeToken(extractTokenFromHeader(req));
      res.json({
        id: decoded.id,
        role: decoded.role
      });
    } catch (e) {
      res.sendStatus(500);
    }
  });

  return router;
}