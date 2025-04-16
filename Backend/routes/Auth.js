const googleAuth = require('../controllers/googleAuthControllers');
const register = require('../controllers/register');
const login = require('../controllers/login');
const verfyEmail = require('../controllers/verfyEmail');
const fogotPassword = require('../controllers/fogotPassword');
const router = require('express').Router();


  //--- user Authenticate using manual crendential ---------
  router.post('/register',register);

  router.post('/login',login);

  router.post('/verfyemail',verfyEmail);

  router.post('/resetPassword',fogotPassword.resetPassword);

  router.post('/sendResetCode',fogotPassword.sendResetCode);

  //---- User Authentication using google --------
  router.get('/google', googleAuth);



module.exports = router;  