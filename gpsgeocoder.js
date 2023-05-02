const NodeGeocoder = require('node-geocoder');
const firebaseLib = require("firebase-admin");
const accountDetails = require('./keytofirebase.json');
const sendHTTPResponse = require('./lib/sendHTTPResponse')
const runQuery = require('./db/runQuery');
const mysql = require('mysql');
const config = require("./firebasemysql");

const getFirebaseConnection = () => {
  firebaseLib.initializeApp({
    credential: firebaseLib.credential.cert(accountDetails),
    databaseURL: "https://esp8266-cd1d4-default-rtdb.firebaseio.com"
  })
}
// Create MySQL connection
const connection = mysql.createConnection(config.mysql);

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});


const main = () => {

  getFirebaseConnection()
  const dbPath = 'd74acef3-7630-484c-b82f-8908bef34c50'

  const options = {
    provider: 'openstreetmap'
  };
  const geocoder = NodeGeocoder(options);

  // Fetch the latitude and longitude from Firebase
  firebaseLib.database().ref(dbPath).once('value')
    .then(snapshot => {
      const data = snapshot.val();
      let latitude = data.latitude;
      let longitude = data.longitude;
      let noOfPerson = data.noOfPerson;
      console.log(data);
      // Call the geocoder.reverse method with the retrieved latitude and longitude
      async function getLocFromGeocoder(latitude, longitude) {
        try {
          const result = await geocoder.reverse({ lat: latitude, lon: longitude });
          // console.log(result); 
          const loc = result[0].formattedAddress.split(',')[0];
          console.log(loc);

          return loc;
        } catch (error) {
          console.error(error);
        }
      }
      const update = async () => {
        try {
          const currentLoc = await getLocFromGeocoder(latitude, longitude);
          const values = [noOfPerson, currentLoc, dbPath];
          console.log(values);
          const query = `Update bus set crowd = ? , currentLoc = ? where uuid = ?`;
          // await runQuery(query,values)
          //   console.log("Updated successfully")
          connection.query(query, values, (err, results) => {
            if (err) {
              console.error(`Error inserting data into table:`, err);
            } else {
              console.log(`Inserted data into table`);
            }
          });
        } catch (err) {
          console.log(err.message)
        }

      };
      update();

    })

};

main();
