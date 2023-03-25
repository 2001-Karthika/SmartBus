const admin = require("firebase-admin");

// Fetch the service account key JSON file contents
const serviceAccount = require("D:\Smart Bus\SmartBus\keytofirebase.json");
/*const firebaseConfig = {
    apiKey: "AIzaSyD6UKIu2bqg4DflxXSTUf6oPtSjcF4mh-I",
    authDomain: "nodemcufirebase-1e00c.firebaseapp.com",
    databaseURL: "https://nodemcufirebase-1e00c-default-rtdb.firebaseio.com",
    projectId: "nodemcufirebase-1e00c",
    storageBucket: "nodemcufirebase-1e00c.appspot.com",
    messagingSenderId: "686775892436",
    appId: "1:686775892436:web:d17a0497cb633b27317e41",
    measurementId: "G-T3LZTG8JMN"
  };*/
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:  "https://nodemcufirebase-1e00c-default-rtdb.firebaseio.com"
});

// Get a database reference to the data
const db = admin.database();
const ref = db.ref("test/");

// Read the data once
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});