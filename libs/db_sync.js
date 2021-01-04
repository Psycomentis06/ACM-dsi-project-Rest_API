// Sync database
const User = require("../models/user");
const Product = require("../models/product");
const History = require("../models/history");
const Contact = require("../models/contact");
User.sync({ alter: true });
Product.sync({ alter: true });
History.sync({ alter: true });
Contact.sync({ alter: true });
