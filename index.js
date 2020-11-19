// imports
var express = require('express');
var app = express();
var admin = require('firebase-admin');
var cors = require('cors');
// Constants
var PORT = process.env.PORT || 3000;
var API_BASE_URI = "/api/v1/";
// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
// Firebase init
var serviceAccount = require('./dsi3-project-firebase-adminsdk-rl8cr-9e76e0fea6.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dsi3-project.firebaseio.com/"
})
// Routes
const userRoutes = require('./routes/user');
app.use(API_BASE_URI+"user", userRoutes);

app.listen(PORT, () => {
    console.log("Listen to localhost:"+PORT);
})