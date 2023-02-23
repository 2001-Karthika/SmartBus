var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/krishna', function(req, res, next) {
  res.send('respond with a krishna');
});
router.get('/fidha', function(req, res, next) {
  res.send('respond with a fidha');
});
router.get('/karthika', function(req, res, next) {
  res.send('respond with a karthika');
});
router.get('/karthika/devika', function(req, res, next) {
  res.send('respond with a devika');
});

module.exports = router;
