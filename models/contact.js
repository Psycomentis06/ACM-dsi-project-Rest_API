const { DataTypes, Model } = require("sequelize");
const sequelize = require("../libs/db");
var uniqid = require("uniqid");

class Contact extends Model {}

Contact.init(
  {
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isAlpha: {
          msg: "First name must be letters only",
        },
        len: {
          args: [3, 30],
          msg: "First name length should be greater than 3 lower than 35",
        },
        notNull: {
          msg: "First name is required",
        },
      },
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Invalid Email format",
        },
        notNull: {
          msg: "Email is required",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isAlpha: {
          msg: "Description must be letters only",
        },
        notNull: {
          msg: "Description is required",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          msg: "Phone number should be numeric",
        },
      },
    },
    seen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Contact",
  }
);

//Contact.sync({alter: true})

module.exports = Contact;
