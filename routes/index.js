const { request } = require('express');
const express = require('express');
const router = express.Router();
const runQuery = require('../db/runQuery');
const sendHTTPResponse = require('../lib/sendHTTPResponse')
const query = require('./query');

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    // User is logged in, proceed to next middleware
    next();
  } else {
    // User is not logged in, redirect to login page
    res.redirect('/login');
  }
}

router.get('/', function (request, response) {
  response.redirect('/login');
});

router.get('/login', function (request, response) {
  console.log("first")
  if (request.session.user) {
    // User is already logged in, redirect to dashboard
    response.redirect('/analytics');
  } else {
    // User is not logged in, render login page
    response.render('login/login.ejs');
  }
  
});

router.get('/signup', function (request, response) {
  response.render('signup/signup.ejs');
});

router.get('/analytics', isLoggedIn, function (req, res) {
  res.render('admin/analytics.ejs')
})

router.get('/driver-dashboard', isLoggedIn, function (req, res) {
  res.render('driver/driver-dashboard.ejs')
})

router.get('/qrscanner', isLoggedIn,function (req, res) {
  res.render('driver/qrscanner.ejs');
})


router.post('/signup', async function (request, response) {
  const username = request.body.username
  const fullname = request.body.fullname // getting data that are send form frontend. Since it is through body, so request.body
  const emailid = request.body.email
  const phone = request.body.phone
  const password = request.body.password
  const userType = 2
  // const a = 'INSERT INTO `smartbus`.`passenger` ( `name`, `username`,`password`, user_type, `email`, `ph_num`) VALUES (?,?,?,?,?,?);'
  // const a = query.addPassenger()
  await runQuery(query.addPassenger(), [fullname, username, password, userType, emailid, phone])
  sendHTTPResponse.success(response, "Response successfull");
});


router.post("/login", async function (req, res) {
  const username = req.body.username
  const password = req.body.password
  req.session.user = username
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

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// when login is success

router.get('/driver-details', isLoggedIn, function (request, res) {
  res.render('admin/driver.ejs')
});


router.get('/driver', isLoggedIn, async function (request, res) {
  const query = `SELECT * FROM driver`
  const driverlist = await runQuery(query)
  sendHTTPResponse.success(res, "Response successfull", driverlist);
});

router.post('/driver', async function (req, res) {
  try{
    console.log(req.body)
  const username = req.body.username 
  const password = req.body.password
  const adminID = ~~ req.body.adminID
  const mobile = req.body.mobile
  const email = req.body.email
  const name = req.body.name
  const userType = 1
  const query = 'INSERT INTO smartbus.driver (name, username, password, user_type, email, ph_num, admin_id) VALUES (?,?,?,?,?,?,?);'
  await runQuery(query,[ name, username,  password, userType, email, mobile,  adminID])
  sendHTTPResponse.success(res, "Driver details added successfully")
  }
  catch (err) {
    console.log(err.message)
    sendHTTPResponse.error(res, "Error in adding credentials",)
  }
});

router.get('/bus-details', isLoggedIn, function (request, res) {
  res.render('admin/bus.ejs')
});

router.get('/bus', isLoggedIn, async function (request, res) {
  const query = `SELECT * FROM bus`
  const buslist = await runQuery(query)
  sendHTTPResponse.success(res, "Response successfull", buslist);
});

router.post('/bus', async function (req, res) {
  try{
    console.log(req.body)
  const bus_number = req.body.bus_number 
  const busfrom = req.body.busfrom
  const busto = req.body.busto
 
  const query = 'INSERT INTO smartbus.bus (bus_number, busfrom, busto) VALUES (?,?,?);'
  await runQuery(query,[ bus_number, busfrom,  busto])
  sendHTTPResponse.success(res, "Bus details added successfully")
  }
  catch (err) {
    console.log(err.message)
    sendHTTPResponse.error(res, "Error in adding credentials",)
  }
});

router.post('/console', (req, res) => {
  const consoleValue = req.body.consoleValue;
  console.log(consoleValue.data);
  // Use QR data   

  res.send('Received console value');
});

module.exports = router;

//READ THIS
// sendHTTPResponse has two sub function
// 1. success which take parameter (response, message, data, statusCode)
// response mandatory field others are optional fields
// 2. error 
// response mandatory field others are optional fields

