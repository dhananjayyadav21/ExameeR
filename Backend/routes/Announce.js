const AnnounceMentController = require('../controllers/AnnounceMentController');
const fetchUser = require("../middleware/fetchUser");
const router = require('express').Router();

  //---- announce --------
  router.get('/getAllUser',fetchUser, AnnounceMentController.getAllUsers);

  router.post('/sendAnnouncement',fetchUser, AnnounceMentController.sendAnnouncement);

module.exports = router;  