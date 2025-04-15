const googleAuth = require('../controllers/googleAuthControllers')
const router = require('express').Router();


  //============================== create A new User using POST: auth/register ==================================
  router.get('/register', (req, res) => {
    res.send("hellow register")
  });

  router.get('/google', googleAuth);



module.exports = router;  