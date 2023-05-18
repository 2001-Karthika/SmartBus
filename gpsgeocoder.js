const NodeGeocoder = require('node-geocoder');
const firebaseLib = require("firebase-admin");
const accountDetails = require('./keytofirebase.json')
const IORedis = require('ioredis')
const redisIOClient = new IORedis()
const runQuery = require('./db/runQuery')

const getFirebaseConnection = () => {
  firebaseLib.initializeApp({
    credential: firebaseLib.credential.cert(accountDetails),
    databaseURL: "https://esp8266-cd1d4-default-rtdb.firebaseio.com"
  })
}

const callbackService = () => {
  const dbPath = 'd74acef3-7630-484c-b82f-8908bef34c50'

  const options = {
    provider: 'openstreetmap'
  };
  const geocoder = NodeGeocoder(options);

  // Fetch the latitude and longitude from Firebase
  firebaseLib.database().ref(dbPath).once('value')
    .then(snapshot => {
      const data = snapshot.val()
      let latitude = data?.latitude
      let longitude = data?.longitude
      let noOfPerson = data?.noOfPerson
      // Call the geocoder.reverse method with the retrieved latitude and longitude
      async function getLocFromGeocoder(latitude, longitude) {
        try {
          const result = await geocoder.reverse({ lat: latitude, lon: longitude })
          const loc = result[0].formattedAddress.split(',')[0]
          return loc;
        } catch (error) {
          console.error(error);
        }
      }
      const update = async () => {
        try {
          const currentLoc = await getLocFromGeocoder(latitude, longitude)
          const values = [noOfPerson, currentLoc, dbPath]
          redisIOClient.hmset('smartbus_settings', 'no_of_persons', noOfPerson??0,
                                                    'current_location', currentLoc??'',
                                                    )
          console.log(values);
          const query = `Update bus set crowd = ? , currentLoc = ? where uuid = ?`;
          //add redis update
          await runQuery(query, values)
        } catch (err) {
          console.log(err.message)
        }

      };
      update();

    })

};
const main = () => {
  getFirebaseConnection()
  setInterval(() => {
    callbackService()
  }, 3000)
}
main()

