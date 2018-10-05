const { generateToken, decodeToken, extractTokenFromHeader } = require('../helpers/auth')
const storage = require('../storage/index')

const signup = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password){
    res.sendStatus(400);
    return;
  }

  try {
    const user = await storage.saveUser(req.sql, username, password);
    const token = generateToken(user.id)
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password){
    res.sendStatus(400);
    return;
  }

  try {
    const user = await storage.getUser(req.sql, username, password);
    if (user){
      const token = generateToken(user.id)
      res.json({ token });
    } else {
      res.sendStatus(401)
    }
  } catch (e) {
    res.status(401).json({ error: e });
  }

}

const me = async (req, res) => {
  try {
    const decoded = await decodeToken(extractTokenFromHeader(req));
    res.json({
      id: decoded.id,
      role: decoded.role
    });
  } catch (e) {
    res.status(500);
  }
}


module.exports = {
  signup,
  login,
  me
}