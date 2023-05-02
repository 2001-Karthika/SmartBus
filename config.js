const firebaseLib = require("firebase-admin")
const accountDetails = require('./keytofirebase.json');
const mysql = require('mysql');
const config = require("./firebasemysql");
const NodeGeocoder = require('node-geocoder');

const getFirebaseConnection = () => {
  firebaseLib.initializeApp({
    credential: firebaseLib.credential.cert(accountDetails),
    databaseURL: 'https://esp8266-cd1d4-default-rtdb.firebaseio.com'
  })
}
async function addValue(dbPath, data){
  try{
    getFirebaseConnection()
    const firebaseDB = firebaseLib.database()
    const refDB = firebaseDB.ref(dbPath)
    await refDB.set(data);
    firebaseLib.app().delete();
  }
  catch(error){
    console.log(`FIREBASE CONFIG | addValue | error: ${error.message}`)
  }
}
async function getValue(dbPath){
  try{
    getFirebaseConnection()
    const firebaseDB = firebaseLib.database()
    const refDB = firebaseDB.ref(dbPath)
    await refDB.once("value", function (snapshot) {
    console.log(snapshot.val());
    });
    firebaseLib.app().delete();

  }
  catch(error){
    console.log(`FIREBASE CONFIG | getValue | error: ${error.message}`)
  }
}

  const data = {
    latitude : '9.40',
    longitude : '96.909',
    noOfPerson: '55'
  }
//getValue('9fc21794-bca3-4f53-8335-d8ae935ef1b4')
getFirebaseConnection()

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

const options = {
  provider: 'openstreetmap'
};
const geocoder = NodeGeocoder(options);


// Listen for changes in Firebase database
firebaseLib.database().ref().on("value", (snapshot) => {
  const data = snapshot.val();
  // Loop through each data item and update the respective MySQL table
  Object.keys(data).forEach((key) => {
    const table = key;
    const items = data[key];
    async function getLocFromGeocoder(latitude, longitude) {
      try {
        const result = await geocoder.reverse({ lat: latitude, lon: longitude });
        const loc =  result[0].formattedAddress.split(',')[0];
        // console.log(loc); 
        return loc; 
      } catch (error) {
        console.error(error);
      }
    }
      const currentLoc = getLocFromGeocoder(items.latitude, items.longitude);
      const values = [items.noOfPerson,currentLoc,table];
      // console.log(currentLoc)
      const sql = `Update bus set crowd = ? and currentLoc = '?' where uuid = ?`;
      connection.query(sql, values, (err, results) => {
        if (err) {
          console.error(`Error inserting data into ${table} table:`, err);
        } else {
          console.log(`Inserted data into ${table} table`);
        }
      });
    
  });
});
