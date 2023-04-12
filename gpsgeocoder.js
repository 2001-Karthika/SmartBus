const NodeGeocoder = require('node-geocoder');
const firebaseLib = require("firebase-admin")
const accountDetails = require('./keytofirebase.json');

const getFirebaseConnection = () => {
  firebaseLib.initializeApp({
    credential: firebaseLib.credential.cert(accountDetails),
    databaseURL:  "https://esp8266-cd1d4-default-rtdb.firebaseio.com"
  })
}

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
      const latitude = data.latitude;
      const longitude = data.longitude;
      // Call the geocoder.reverse method with the retrieved latitude and longitude
      geocoder.reverse({ lat: latitude, lon: longitude })
        .then((result) => {
          console.log(result[0].formattedAddress);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

main();
