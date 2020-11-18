require('dotenv').config();
/*var mysql = require('mysql');

var pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10
})

module.exports = pool;*/

const { Sequelize } = require('sequelize');

try {
    const sequelize = new Sequelize({
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: 'mysql'
    });

    sequelize.authenticate();
    module.exports = sequelize;
} catch (error) {
    console.error("Connection error");
}