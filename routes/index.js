const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/login', function(req, res) {
  res.render('login/login.ejs');
});
router.post('/login', function(req, res) {
  res.status(200).send({success: false, error: {message: 'No blah Found'}});
});
router.get('/dashboard', function(req, res) {
  res.status(200).send({success: false, error: {message: 'No blah Found'}});
});

module.exports = router;
