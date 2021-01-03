const { DataTypes, Model } = require("sequelize");
const sequelize = require("../libs/db");

class Like extends Model {}

Like.init(
  {
    clientid: { type: DataTypes.STRING(100) },
    productid: { type: DataTypes.INTEGER },
  },
  {
    sequelize,
    modelName: "Like",
  }
);

//Like.sync({alter: true})

module.exports = Like;
