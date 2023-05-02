const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const { request } = require('express');
const express = require('express');
const router = express.Router();
const runQuery = require('D:/Smart Bus/SmartBus/db/runQuery.js');
const server = http.createServer(router);
const io = socketio(server);
const redis = require('redis');
const { route } = require('./routes');



let updatedbreakdownCount = 0;
let updatednotOnrouteCount = 0;
let updatedonrouteCount = 0;
let notOnrouteCount = 0;
let breakdownCount = 0;

const query = `SELECT count(*) FROM bus where status = 1`
let onrouteCount = runQuery(query)

const client = redis.createClient(6379,5000);

(async () => {
  await client.connect();
})();

client.on('connect', () => {
  console.log('Connected to Redis server');
});
client.on('error', (err) => {
  console.error('Redis error:', err);
});


client.set('onrouteCount', JSON.stringify(onrouteCount));
client.set('notOnrouteCount', JSON.stringify(notOnrouteCount));
client.set('breakdownCount', JSON.stringify(breakdownCount), (err) => {
  if (err) {
    console.error('Error saving counts in Redis:', err);
  } else {
    console.log('Counts saved in Redis');
  }
});

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

  socket.emit('counts-update', {
    onrouteCount,
    notOnrouteCount,
    breakdownCount,
  });
});

  socket.on('test',(data)=>{
    console.log({data})
  })
  socket.emit('backendEvent', 'Hello from server!');
  // Handle incoming socket events here
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

client.get('onRouteCount', (err, result) => {
  updatedonrouteCount = result??onrouteCount
  if (err) {
    console.error('Error retrieving on-route count from Redis:', err);
  } else {
    console.log('On-route count:', result);
  }
});

client.get('notOnrouteCount', (err, result) => {
  updatednotOnrouteCount = result??notOnrouteCount
  if (err) {
    console.error('Error retrieving not-on-route count from Redis:', err);
  } else {
    console.log('Not-on-route count:', result);
  }
});

client.set('onRouteCount', updatedonrouteCount);
client.set('notOnRouteCount', updatednotOnrouteCount);
client.set('breakdownCount', updatedbreakdownCount, (err) => {
  if (err) {
    console.error('Error updating counts in Redis:', err);
  } else {
    console.log('Counts updated in Redis');
  }
});

// router.get('admin/analytics', (req, res) => {
//   router.render('admin/analytics', { 
//     onrouteCount: onrouteCount,
//     notOnrouteCount: notOnrouteCount,
//     breakdownCount: breakdownCount
//   });

server.listen(8080, () => {
  console.log('Server listening on port 8080');
});