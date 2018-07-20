const jwt = require('jsonwebtoken')
const SUPER_SECRET = 'abcdefghijklmnopqrst'

const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return;
  }

  const bearer = authHeader.split(' ')[1];
  if (bearer){
    return bearer
  }
}

const generateToken = (identifier) => {
  return jwt.sign({
    id: identifier,
    role: 'user'
  }, SUPER_SECRET, {
    expiresIn: 1440
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

const decodeToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SUPER_SECRET, (err, decoded) => {
      if (err) {
        reject();
      } else {
        resolve(decoded);
      }
    });
  })
}

const tokenVerificationMiddleWare = (req, res, next) => {
  const bearer = extractTokenFromHeader(req);
  if (bearer && isValidToken(bearer)){
    next()
  } else {
    res.sendStatus(401)
  }
}

module.exports = {
  extractTokenFromHeader,
  generateToken,
  isValidToken,
  decodeToken,
  tokenVerificationMiddleWare
}