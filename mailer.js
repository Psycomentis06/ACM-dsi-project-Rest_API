const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
var transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
        user: "apikey",
        pass: "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"
    },
    tls: {
        rejectUnauthorized: false
    }
})

// template engine middleware

transporter.use('compile', hbs({
    viewEngine: {
        extname: '.hbs', // handlebars extension
        layoutsDir: 'templates', // location of handlebars templates
        defaultLayout: 'email_verification', // name of main template
    },
    viewPath: "templates",
    extName: '.hbs'
}))

module.exports = transporter;