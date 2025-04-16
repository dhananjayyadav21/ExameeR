const googleAuth = require('../controllers/googleAuthControllers');
const register = require('../controllers/register');
const login = require('../controllers/login');
const router = require('express').Router();


  //--- user Authenticate using manual crendential ---------
  router.post('/register',register);

  router.post('/login',login);

  //---- User Authentication using google --------
  router.get('/google', googleAuth);



module.exports = router;  