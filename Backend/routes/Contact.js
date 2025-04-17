const router = require('express').Router();
const support = require('../controllers/support');

//--- user contact using email ---------
router.post('/support',support);

module.exports = router;  