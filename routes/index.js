const { request } = require('express');
const express = require('express');
const router = express.Router();
const runQuery = require('../db/runQuery');
const sendHTTPResponse = require('../lib/sendHTTPResponse')
const query = require('./query');
const { v4: uuidv4 } = require('uuid');

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

router.get('/qrscanner', isLoggedIn, function (req, res) {
  res.render('driver/qrscanner.ejs');
})

router.get('/passenger-dashboard',isLoggedIn , async function (req, res) {
  const busFrom = (await runQuery(query.getDistinctBusFrom()))
  const busTo = (await runQuery(query.getDistinctBusTo()))
  res.render('passenger/passenger-dashboard.ejs', { busFrom, busTo });
})

router.get('/route-selection', isLoggedIn, function (req, res) {
  res.render('passenger/route-selection.ejs');
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
  const query = `SELECT * FROM driver where status = 1`
  const driverlist = await runQuery(query)
  sendHTTPResponse.success(res, "Response successfull", driverlist);
});

router.post('/driver', async function (req, res) {
  try {
    console.log(req.body)
    const username = req.body.username
    const password = req.body.password
    const adminID = ~~req.body.adminID
    const mobile = req.body.mobile
    const email = req.body.email
    const name = req.body.name
    const userType = 1
    const status = 1
    const query = 'INSERT INTO smartbus.driver (name, username, password, user_type, email, ph_num, admin_id, status) VALUES (?,?,?,?,?,?,?,?);'
    await runQuery(query, [name, username, password, userType, email, mobile, adminID , status])
    sendHTTPResponse.success(res, "Driver details added successfully")
  }
  catch (err) {
    console.log(err.message)
    sendHTTPResponse.error(res, "Error in adding credentials",)
  }
});

router.put('/driver/:id/inactive', function(req, res) {
  try{
   const driverId = req.params.id;
   const query = 'UPDATE driver SET status = 0 WHERE id = ?'
   runQuery(query, [driverId])
   res.sendStatus(200); 
  }
  catch (err) {
    console.log(err.message)
    res.sendStatus(500); 
  }
});

router.get('/bus-details', isLoggedIn, function (request, res) {
  res.render('admin/bus.ejs')
});

router.get('/bus', isLoggedIn, async function (request, res) {
  const query = `SELECT * FROM bus where status = 1`
  const buslist = await runQuery(query)
  sendHTTPResponse.success(res, "Response successfull", buslist);
});

router.post('/bus', async function (req, res) {
  try {
    console.log(req.body)
    const bus_number = req.body.bus_number
    const busfrom = req.body.busfrom
    const busto = req.body.busto
    const uuid = uuidv4()
    const status = 1
    console.log(uuid);

    const query = 'INSERT INTO smartbus.bus (bus_number, busfrom, busto, uuid,status) VALUES (?,?,?,?,?);'
    await runQuery(query, [bus_number, busfrom, busto, uuid, status])
    sendHTTPResponse.success(res, "Bus details added successfully")
  }
  catch (err) {
    console.log(err.message)
    sendHTTPResponse.error(res, "Error in adding credentials",)
  }
});

router.put('/bus/:id/inactive', function(req, res) {
  try{
   const busId = req.params.id;
   const query = 'UPDATE bus SET status = 0 WHERE id = ?'
   runQuery(query, [busId])
   res.sendStatus(200); 
  }
  catch (err) {
    console.log(err.message)
    res.sendStatus(500); 
  }
});

router.post('/console', async function (req, res) {
  try {
    const consoleValue = req.body.consoleValue.data;
    const query = 'Select * from bus where uuid= ?'
    const runquery = await runQuery(query, consoleValue)
    console.log(runquery)
    sendHTTPResponse.success(res, "Bus details collected successfully", runquery)
  }
  catch (err) {
    console.log(err.message)
    sendHTTPResponse.error(res, "Error in collecting data",)
  }
  //console.log(consoleValue.data);
  // Use QR data   
   
});

router.get('/passenger-bus-details', async function (req, res) {
  try {
    const fromLocation = req.query.from
    const toLocation = req.query.to
    const query = 'Select * from bus where busfrom= ? and busto= ? '
    const result = await runQuery(query, [fromLocation, toLocation])
    sendHTTPResponse.success(res, "Bus selected successfully", result)
  }
  catch (err) {
    console.log(err.message)
    sendHTTPResponse.error(res, "Error in selecting location",)
  }
});

module.exports = router;

//READ THIS
// sendHTTPResponse has two sub function
// 1. success which take parameter (response, message, data, statusCode)
// response mandatory field others are optional fields
// 2. error 
// response mandatory field others are optional fields

