const jwt = require('jsonwebtoken')
const SUPER_SECRET = 'abcdefghijklmnopqrst'

const generateToken = (identifier) => {
  return jwt.sign({
    role: 'user'
  }, SUPER_SECRET, {
    expiresIn: 1
  })
}

const isValidToken = (token) => {
  try {
    jwt.verify(token, SUPER_SECRET);
  } catch (e) {
    return false;
  }

  return true
}

const tokenVerificationMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader){
    res.sendStatus(401);
    return;
  }

  const bearer = authHeader.split(' ')[1];
  if (isValidToken(bearer)){
    next()
  } else {
    res.sendStatus(401)
  }
}

module.exports = {
  generateToken,
  isValidToken,
  tokenVerificationMiddleWare
}