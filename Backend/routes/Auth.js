const express = require('express');


const router = express.Router();

//============================== create A new User using POST: examee/auth/register ==================================
router.get('/register', (req, res) => {
    res.send('Hello World!')
  })

module.exports = router;  