var fireAdmin = require("firebase-admin");
// Firebase init
var serviceAccount = require("./dsi3-project-firebase-adminsdk-rl8cr-9e76e0fea6.json");
fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert(serviceAccount),
  databaseURL: "https://dsi3-project.firebaseio.com/",
});

module.exports = fireAdmin;
