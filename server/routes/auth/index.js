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
      const user = await storage.saveUser(username, password, req.sql);
      const token = generateToken(user.id)
      res.json({ token });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password){
      res.sendStatus(400);
      return;
    }

    try {
      const user = await storage.getUser(username, password, req.sql);
      if (user){
        const token = generateToken(user.id)
        res.json({ token });
      } else {
        res.sendStatus(401)
      }
    } catch (e) {
      res.status(401).json({ error: e });
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
      res.status(500);
    }
  });

  return router;
}