const ContentController = require("../controllers/ContentController");
const MylearningControllers = require('../controllers/MyLearningConrollers');
const fetchUser = require("../middleware/fetchUser");
const router = require('express').Router();

  //--- Content uplodes ---------

  router.post('/addNotes',fetchUser, ContentController.uploadNotes);
  router.post('/addPYQ',fetchUser, ContentController.uploadPYQ);
  router.post('/addVideo',fetchUser, ContentController.uploadVideo);
  router.post('/addInMylearning',fetchUser, MylearningControllers.addInMylearning);

  router.get('/getAllPublicNotes',fetchUser, ContentController.getAllPublicNotes);
  router.get('/getAllPublicPYQ',fetchUser, ContentController.getAllPublicPYQ);
  router.get('/getAllPublicVideo',fetchUser, ContentController.getAllPublicVIDEO); 

  router.get('/getLatestUpload',fetchUser, ContentController.getLatestUpload); 

module.exports = router;  