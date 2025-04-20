const googleAuth = require('../controllers/googleAuthControllers');
const Authcontroller = require('../controllers/AuthController');
// const register = require('../controllers/register');
// const login = require('../controllers/login');
// const verfyEmail = require('../controllers/verfyEmail');
// const fogotPassword = require('../controllers/fogotPassword');
// const getUser = require('../controllers/getUser');
const fetchUser = require("../middleware/fetchUser");
const router = require('express').Router();

  //--- user Authenticate using manual crendential ---------
  router.post('/register',Authcontroller.register);

  router.post('/login',Authcontroller.login);

  router.post('/verfyemail',Authcontroller.verifyEmail);

  router.post('/resetPassword',Authcontroller.resetPassword);

  router.post('/sendResetCode',Authcontroller.sendResetCode);

  router.get('/getUser',fetchUser, Authcontroller.getUser);

  router.get('/verifyToken', Authcontroller.verifyToken);

  //---- User Authentication using google --------
  router.get('/google', googleAuth);

module.exports = router;  