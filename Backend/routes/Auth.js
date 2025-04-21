const googleAuth = require('../controllers/googleAuthControllers');
const Authcontroller = require('../controllers/AuthController');
const fetchUser = require("../middleware/fetchUser");
const createAdmin = require("../middleware/CreateAdmin");
const router = require('express').Router();

  //--- user Authenticate using manual crendential ---------
  router.post('/register',createAdmin ,Authcontroller.register);

  router.post('/login',Authcontroller.login);

  router.post('/verfyemail',Authcontroller.verifyEmail);

  router.post('/resetPassword',Authcontroller.resetPassword);

  router.post('/sendResetCode',Authcontroller.sendResetCode);

  router.get('/getUser',fetchUser, Authcontroller.getUser);

  router.get('/verifyToken', Authcontroller.verifyToken);

  //---- User Authentication using google --------
  router.get('/google', googleAuth);

module.exports = router;  