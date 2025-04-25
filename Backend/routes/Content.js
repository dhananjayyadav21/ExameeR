const ContentController = require("../controllers/ContentController");
const MylearningControllers = require('../controllers/MyLearningConrollers');
const searchController = require('../controllers/SearchControllers');
const dashboardContentControllers = require('../controllers/dashbordContentControllers');
const fetchUser = require("../middleware/fetchUser");
const router = require('express').Router();

  //--- Content uplodes ---------

  router.post('/addNotes',fetchUser, ContentController.uploadNotes);
  router.post('/addPYQ',fetchUser, ContentController.uploadPYQ);
  router.post('/addVideo',fetchUser, ContentController.uploadVideo);
  router.get('/getAllPublicNotes',fetchUser, ContentController.getAllPublicNotes);
  router.get('/getAllPublicPYQ',fetchUser, ContentController.getAllPublicPYQ);
  router.get('/getAllPublicVideo',fetchUser, ContentController.getAllPublicVIDEO);

  router.get('/getLatestUpload',fetchUser, ContentController.getLatestUpload); 
  router.get('/searchContent', searchController.searchContent);

  router.get('/dashbordContent',fetchUser, dashboardContentControllers.dasContentDeatails);
  router.get('/dashbordAnlytics',fetchUser, dashboardContentControllers.dashbordAnlytics);
  router.get('/getStudentsByRole',fetchUser, dashboardContentControllers.getStudentsByRole);//

  router.post('/addInMylearning',fetchUser, MylearningControllers.addInMylearning);
  router.post('/removeFromMyLearning',fetchUser, MylearningControllers.removeFromMyLearning);
  router.get('/getDatafromMyLearning',fetchUser, MylearningControllers.getDatafromMyLearning);

module.exports = router;  