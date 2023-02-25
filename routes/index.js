const express = require('express');
const router = express.Router();
const runQuery = require('../db/runQuery');
const sendHTTPResponse = require('../lib/sendHTTPResponse')


router.get('/', function(request, response) {
  response.redirect('/login');
});

router.get('/login', function(request, response) {
  response.render('login/login.ejs');
});
router.post('/login', function(request, response) {
  const username = request.body.username // getting data that are send form frontend. Since it is through body, so request.body
  const password = request.body.password
  const userType = request.body.userType
  sendHTTPResponse.success(response, "Response successfull");
});

router.get('/signup', function(request, response) {
  response.render('signup/signup.ejs');
});

router.post('/signup', function(request, response) {
  const username = request.body.username
  const fullname = request.body.fullname // getting data that are send form frontend. Since it is through body, so request.body
  const emailid = request.body.emailid
  const phone = request.body.phone
  const password = request.body.password
 
  sendHTTPResponse.success(response, "Response successfull");
});
// router.post('/login', function(request, response) {
//   response.render('login/login.ejs');
// });

router.get('/dashboard', function(request, res) {
  sendHTTPResponse.success(response, "Response successfull");
});

module.exports = router;

//READ THIS
// sendHTTPResponse has two sub function
// 1. success which take parameter (response, message, data, statusCode)
// response mandatory field others are optional fields
// 2. error 
// response mandatory field others are optional fields

