const firebaseLib = require("firebase-admin")
const accountDetails = require('./keytofirebase.json');

const getFirebaseConnection = () => {
  firebaseLib.initializeApp({
    credential: firebaseLib.credential.cert(accountDetails),
    databaseURL: 'https://arduino-to-esp8266-to-firebase-default-rtdb.firebaseio.com'
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
    busName: 'KL-01_CF-2211',
    noOfPerson: '30'
  }
getValue('test')