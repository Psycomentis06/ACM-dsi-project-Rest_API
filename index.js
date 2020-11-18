// imports
var express = require('express');
var app = express();
var admin = require('firebase-admin');
var cors = require('cors');
var whitelist = require('./libs/cors.origin');
// Port
var PORT = process.env.PORT || 3000;
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
app.get('/', (req, res) =>{
    var sql = require('./libs/db');

    sql.query('SELECT * FROM user', (error, result, field) => {
        if (error) {
            return console.log(error.message);
        }
        res.json({
            data: result
        })
    })
})

app.listen(PORT, () => {
    console.log("Listen to localhost:"+PORT);
})