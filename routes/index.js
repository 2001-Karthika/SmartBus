const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/karthika', function(req, res) {
  res.render('login.html', { titles: 'Fidha' });
});

module.exports = router;
