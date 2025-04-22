const ContentController = require("../controllers/ContentController");
const fetchUser = require("../middleware/fetchUser");
const router = require('express').Router();

  //--- Content uplodes ---------

  router.post('/addNotes',fetchUser, ContentController.uploadNotes);
  router.post('/addPYQ',fetchUser, ContentController.uploadPYQ);
  router.post('/addVideo',fetchUser, ContentController.uploadVideo);

  router.get('/getAllPublicNotes',fetchUser, ContentController.getAllPublicNotes);
  router.get('/getAllPublicPYQ',fetchUser, ContentController.getAllPublicPYQ);

module.exports = router;  