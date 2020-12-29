const { DataTypes, Model } = require("sequelize");
const sequelize = require("../libs/db");

class History extends Model {}

History.init(
  {
    day: {
      type: DataTypes.DATE,
    },
    loggedUsers: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
    likedProducts: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
    orders: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "History",
  }
);

module.exports = History;
