const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const IORedis = require('ioredis')
const redisIOClient = new IORedis()
const express = require('express');
const router = express.Router();
const runQuery = require('./db/runQuery')
const server = http.createServer(router)
const io = socketio(server);
const redis = require('redis')



let updatedbreakdownCount = 0;
let updatednotOnrouteCount = 0;
let updatedonrouteCount = 0;
let notOnrouteCount = 0;
let breakdownCount = 0;

const query = `SELECT count(*) FROM bus where status = 1`
let onrouteCount = runQuery(query)


 router.use(cors())

io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('driver-update', (data) => {
    // Update counts and statuses based on the changes
    if (data.status === 'onroute') {
      onrouteCount++;
      notOnrouteCount--;
    } else if (data.status === 'not-onroute') {
      notOnrouteCount++;
      onrouteCount--;
    } else if (data.status === 'breakdown') {
      breakdownCount++;
      notOnrouteCount++;
      onrouteCount--;
    }


  });
  
  const updateCount = async ()=>{
    const query = `  SELECT
    (SELECT COUNT(id) FROM bus WHERE status = 1) AS running,
    (SELECT COUNT(id) FROM bus WHERE status = 3) AS breakdown,
    (SELECT COUNT(id) FROM bus WHERE status = 0) AS not_running;`
    const busStatusCount = await runQuery(query)
    const noOfPersons = await redisIOClient.hget('smart_settings','no_of_persons') ?? 0
    const currentLocation = await redisIOClient.hget('smart_settings','current_location') ?? 'Fetching Data...'
    const data = {noOfPersons, currentLocation, ...busStatusCount[0]}
    console.log({data})
    socket.emit('update-count', data)
    socket.on('disconnect', () => {
      console.log('user disconnected');
    })
  }
  const conuntUpdator = ()=>{
    console.log("first")
    setInterval(()=>{
      updateCount()
    },3000)
  }
  conuntUpdator()


  socket.emit('backendEvent', 'Hello from server!');
  // Handle incoming socket events here
  // socket.on('disconnect', () => {
  //   console.log('user disconnected');
  // });
});

server.listen(8080, () => {
  console.log('Server listening on port 8080');
});