const express = require('express');
const router = express.Router();
const runQuery = require('../db/runQuery');
const sendHTTPResponse = require('../lib/sendHTTPResponse')
const query = require('./query');
const { v4: uuidv4 } = require('uuid');

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', function (request, response) {
  response.redirect('/login');
});

router.get('/login', function (request, response) {
  if (request.session.user) {
    response.redirect('/analytics');
  } else {
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

router.get('/driver-home', async function(req, res) {
  console.log(req.session.userID)
  const query = 'Select * from smartbus.bus where id=?;'
  const result = await runQuery(query, req.session.userID)
  console.log({driverDetails : result[0].busfrom})
  res.render('driver/driver-home.ejs',{busfrom : result[0].busfrom, busto : result[0].busto, busNo : result[0].bus_number})
})
router.post('/bus-status', async function(req, res) {
  try{
    const busID = req.session.userID
    const status = Boolean(req.body.isBusRunning) ? '1' : '0'
    const query = 'update bus set status=? where id=?;'
    await runQuery(query, [status, busID])
    sendHTTPResponse.success(res, "Status Updated")
  }
  catch (err) {
    console.log(err.message)
    sendHTTPResponse.error(res, "Error updating status")
  }
})

router.get('/qrscanner', isLoggedIn, function (req, res) {
  res.render('driver/qrscanner.ejs');
})

router.get('/passenger-dashboard',isLoggedIn , async function (req, res) {
  const busFrom = (await runQuery(query.getDistinctBusFrom()))
  const busTo = (await runQuery(query.getDistinctBusTo()))
  res.render('passenger/passenger-dashboard.ejs', { busFrom, busTo });
})

router.post('/signup', async function (request, response) {
  const username = request.body.username
  const fullname = request.body.fullname 
  const emailid = request.body.email
  const phone = request.body.phone
  const password = request.body.password
  const userType = 2
  await runQuery(query.addPassenger(), [fullname, username, password, userType, emailid, phone])
  sendHTTPResponse.success(response, "Response successfull");
});

router.post("/login", async function (req, res) {
  const username = req.body.username
  const password = req.body.password
  req.session.user = username
  const userType = ~~req.body.userType 
  let query = ""
  if (userType == 0)
    query = 'SELECT * FROM admin WHERE username = ? '
  else if (userType == 1)
    query = 'SELECT * FROM driver WHERE username = ? '
  else
    query = 'SELECT * FROM passenger WHERE username = ? '
  const resp = await runQuery(query, [username])
  const dbPassword = resp[0]?.password
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
   sendHTTPResponse.success(res);
  }
  catch (err) {
    console.log(err.message)
    sendHTTPResponse.error(err);
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
    const bus_number = req.body.bus_number
    const busfrom = req.body.busfrom
    const busto = req.body.busto
    const uuid = uuidv4()
    const status = 1
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
   sendHTTPResponse.success(res);
  }
  catch (err) {
    console.log(err.message)
    sendHTTPResponse.error(res);
  }
});

router.post('/console', async function (req, res) {
  try {
    const uniqueID = req.body.consoleValue.data
    const query = 'Select * from smartbus.bus where uuid= ?'
    const result = await runQuery(query, uniqueID)
    req.session.userID = result[0].id
    sendHTTPResponse.success(res, "Bus details collected successfully", result)
  }
  catch (err) {
    console.log(err.message)
    sendHTTPResponse.error(res, "Error in collecting data",)
  }
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

router.get('/driver-bus-details', async function (req, res) {
  try{
    const uuid = req.query.uuid
    const query = 'Select * from bus where uuid= ?'
    const result = await runQuery(query, uuid)
    sendHTTPResponse.success(res, "Bus chossen successfully", result)
  }
  catch (err) {
    console.log(err.message)
    sendHTTPResponse.error(res, "Error in selecting bus",)
  }
});

module.exports = router;

