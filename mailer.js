const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "dsi3.acm@gmail.com",
    pass: "392817654",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// template engine middleware

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: "hbs", // handlebars extension
      layoutsDir: "templates", // location of handlebars templates
      defaultLayout: false, // name of main template
    },
    viewPath: "templates",
    extName: ".hbs",
  })
);

module.exports = transporter;
