const { DataTypes, Model } = require("sequelize");
const sequelize = require("../libs/db");
var uniqid = require("uniqid");

const User = require("./user");
const Product = require("./product");

class Order extends Model {}
Order.init(
  {
    nproduct: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Adress is required",
        },
      },
    },
    address: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Adress is required",
        },
      },
    },
    state: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveryid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    clientid: { type: DataTypes.STRING(100) },
    productid: { type: DataTypes.INTEGER },
    price: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "Order",
  }
);

/*/  Order.clientid = Order.hasMany(User,{
        as: 'user',
        foreignKey: 'id',
        sourceKey: 'id'
    });
    Order.productid = Order.hasMany(Product,{
        as: 'product',
        foreignKey: 'id',
        sourceKey: 'id'
    });/*/
//Order.sync({alter: true})

module.exports = Order;
