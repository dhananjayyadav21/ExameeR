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
  router.post('/addCourse',fetchUser, ContentController.uploadCourse);

  router.get('/getAllPublicNotes',fetchUser, ContentController.getAllPublicNotes);
  router.get('/getAllPublicPYQ',fetchUser, ContentController.getAllPublicPYQ);
  router.get('/getAllPublicVideo',fetchUser, ContentController.getAllPublicVIDEO);
  router.get('/getAllPublicCourse',fetchUser, ContentController.getAllPublicCourse);

  router.put('/updateNotes/:id',fetchUser, ContentController.updateNotes); 
  router.put('/updatePyq/:id',fetchUser, ContentController.updatePyq); 
  router.put('/updateVideo/:id',fetchUser, ContentController.updateVideo); 
  router.delete('/deleteNote/:id',fetchUser, ContentController.deleteNote); 
  router.delete('/deletePYQ/:id',fetchUser, ContentController.deletePYQ);  
  router.delete('/deleteVideo/:id',fetchUser, ContentController.deleteVideo);  

  router.get('/getLatestUpload',fetchUser, ContentController.getLatestUpload); 
  router.get('/searchContent', searchController.searchContent);

  router.get('/dashbordContent',fetchUser, dashboardContentControllers.dasContentDeatails);
  router.get('/dashbordAnlytics',fetchUser, dashboardContentControllers.dashbordAnlytics);
  router.get('/getStudentsByRole',fetchUser, dashboardContentControllers.getStudentsByRole); 
  router.post('/addStudent',fetchUser, dashboardContentControllers.addStudent);
  router.patch('/changeStudentStatus/:id',fetchUser, dashboardContentControllers.changeStudentStatus);
  router.delete('/deleteStudent/:id',fetchUser, dashboardContentControllers.deleteStudent); 
  router.put('/updateStudent/:id',fetchUser, dashboardContentControllers.updateStudent); 


  router.post('/addInMylearning',fetchUser, MylearningControllers.addInMylearning);
  router.post('/removeFromMyLearning',fetchUser, MylearningControllers.removeFromMyLearning);
  router.get('/getDatafromMyLearning',fetchUser, MylearningControllers.getDatafromMyLearning);

module.exports = router;  