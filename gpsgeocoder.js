const NodeGeocoder = require('node-geocoder');
const firebaseLib = require("firebase-admin");
const accountDetails = require('./keytofirebase.json')
const IORedis = require('ioredis')
const axios = require('axios');
const redisIOClient = new IORedis()
const runQuery = require('./db/runQuery')

const getFirebaseConnection = () => {
  firebaseLib.initializeApp({
    credential: firebaseLib.credential.cert(accountDetails),
    databaseURL: "https://esp8266-cd1d4-default-rtdb.firebaseio.com"
  })
}

async function getLocFromGeocoder(latitude, longitude) {
  try {
    const options = {
      method: 'GET',
      url: 'https://feroeg-reverse-geocoding.p.rapidapi.com/address',
      params: {
        lat: latitude,
        lon: longitude,
        lang: 'en',
        mode: 'text',
        format: '\'[SN[, ] - [23456789ab[, ]\''
      },
      headers: {
        'X-RapidAPI-Key': '567d017794msh0d3e882efdce044p112a1fjsnca9708f983bf',
        'X-RapidAPI-Host': 'feroeg-reverse-geocoding.p.rapidapi.com'
      }
    }
    const response = await axios.request(options)
    return response?.data
  } catch (error) {
    console.error(error.message)
  }
}

const callbackService = async () => {
  try {
    const dbPath = 'd74acef3-7630-484c-b82f-8908bef34c50';
    // Fetch the latitude and longitude from Firebase
    const snapshot = await firebaseLib.database().ref(dbPath).once('value');
    const data = snapshot.val()
    let latitude = data?.latitude
    let longitude = data?.longitude
    let noOfPerson = data?.noOfPerson
    let currentLoc = '';
    try {
      currentLoc = await getLocFromGeocoder(latitude, longitude)
    } catch (err) {
      console.log('Error fetching location from geocoder:', err);
    }
    const dataPoints = [noOfPerson, currentLoc, dbPath];
    console.log({values: dataPoints})
    if (currentLoc)
      redisIOClient.hmset(
        'smartbus_settings',
        'no_of_persons',
        noOfPerson ?? 0,
        'current_location',
        currentLoc ?? ''
      )
    const query = 'UPDATE bus SET crowd = ?, currentLoc = ? WHERE uuid = ?';

    await runQuery(query, dataPoints);
  } catch (err) {
    console.log(err);
  }
};


const main = () => {
  getFirebaseConnection()
  setInterval(() => {
    callbackService()
  }, 5000)
}
main()

