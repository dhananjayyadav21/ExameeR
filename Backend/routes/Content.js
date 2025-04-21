const ContentController = require("../controllers/ContentController");
const fetchUser = require("../middleware/fetchUser");
const router = require('express').Router();

  //--- Content uplodes ---------

  router.post('/addNotes',fetchUser, ContentController.uploadNotes);

  router.post('/addPYQ',fetchUser, ContentController.uploadPYQ);

  router.get('/getAllPublicNotes',fetchUser, ContentController.getAllPublicNotes);
  

module.exports = router;  