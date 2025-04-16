const googleAuth = require('../controllers/googleAuthControllers');
const register = require('../controllers/register');
const login = require('../controllers/login');
const verfyEmail = require('../controllers/verfyEmail');
const router = require('express').Router();


  //--- user Authenticate using manual crendential ---------
  router.post('/register',register);

  router.post('/login',login);

  router.post('/verfyemail',verfyEmail);

  //---- User Authentication using google --------
  router.get('/google', googleAuth);



module.exports = router;  