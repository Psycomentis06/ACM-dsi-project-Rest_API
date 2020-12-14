// Sync database
const User = require("../models/user");
const Product = require("../models/product");
User.sync({ alter: true });
Product.sync({ alter: true });
