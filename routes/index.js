const { request } = require('express');
const express = require('express');
const router = express.Router();
const runQuery = require('../db/runQuery');
const sendHTTPResponse = require('../lib/sendHTTPResponse')

router.get('/', function (request, response) {
  response.redirect('/login');
});

router.get('/login', function (request, response) {
  response.render('login/login.ejs');
});

router.get('/signup', function (request, response) {
  response.render('signup/signup.ejs');
});

router.get("/welcome", function (req, res) {
  res.render('welcome/welcome.ejs')
})

router.post('/signup', async function (request, response) {
  const username = request.body.username
  const fullname = request.body.fullname // getting data that are send form frontend. Since it is through body, so request.body
  const emailid = request.body.email
  const phone = request.body.phone
  const password = request.body.password
  const userType = 2
  const a = 'INSERT INTO `smartbus`.`passenger` ( `name`, `username`,`password`, user_type, `email`, `ph_num`) VALUES (?,?,?,?,?,?);'
  const res = await runQuery(a, [fullname, username, password, userType, emailid, phone])
  sendHTTPResponse.success(response, "Response successfull");
});


router.post("/login", async function (req, res) {
  const username = req.body.username
  const password = req.body.password
  const userType = ~~req.body.userType //0-> ADMIM, 1-> DRIVER, 2-> PASSENGER
  let query = ""
  if (userType == 0)
    query = 'SELECT * FROM admin WHERE username = ? '
  else if (userType == 1)
    query = 'SELECT * FROM driver WHERE username = ? '
  else
    query = 'SELECT * FROM passenger WHERE username = ? '
  const resp = await runQuery(query, [username])
  const dbPassword = resp[0]?.password
  console.log(dbPassword, password)
  if (dbPassword == password) {
    sendHTTPResponse.success(res, "Response successfull")
  }
  else {
    sendHTTPResponse.error(res, "Response unsuccessfull")
  }
})

// when login is success

router.get('/dashboard', function (request, res) {
  sendHTTPResponse.success(response, "Response successfull");
});

module.exports = router;

//READ THIS
// sendHTTPResponse has two sub function
// 1. success which take parameter (response, message, data, statusCode)
// response mandatory field others are optional fields
// 2. error 
// response mandatory field others are optional fields

