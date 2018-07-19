const { generateToken } = require('../../helpers/auth')

module.exports = (router) => {
  router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password){
      res.sendStatus(400);
    }

    //save user info here first

    const token = generateToken()
    res.json({ token });
  })

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password){
      res.sendStatus(400);
    }

    // look for real user
    if (username === 'tjosan' && password === 'password'){
      res.sendStatus(200)
    } else {
      res.sendStatus(401);
    }
  })
}