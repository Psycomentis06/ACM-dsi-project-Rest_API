const nodemailer = require('nodemailer');

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

module.exports = transporter;