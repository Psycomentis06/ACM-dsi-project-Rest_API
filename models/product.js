const { DataTypes, Model } = require("sequelize");
const sequelize = require("../libs/db");

class Product extends Model {}

Product.init(
  {
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Tilte name is required",
        },
        len: {
          args: [1, 300],
          msg: "Title length limit is 300",
        },
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Price is required",
        },
        max: {
          args: [999999],
          msg: "999999 is maximum value",
        },
        min: {
          args: [0],
          msg: "0 is the minimum value",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Description is required",
        },
      },
    },
    imageurl: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: "url is required",
        },
      },
    },
    backgroundcolor: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Color is required",
        },
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Number is required",
        },
        max: {
          args: [9999],
          msg: "9999 is the maximum value",
        },
        min: {
          args: [0],
          msg: "0 is the minimum value",
        },
      },
    },
    category: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notNull: {
          msg: "category is required",
        },
      },
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "discount is required",
        },
        max: {
          args: [100],
          msg: "100 is the maximum value",
        },
        min: {
          args: [0],
          msg: "0 is the minimum value",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Product",
  }
);

//Product.sync({alter: true})

module.exports = Product;
