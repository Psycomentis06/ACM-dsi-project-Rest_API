const { DataTypes, Model } = require("sequelize");
const sequelize = require("../libs/db");
class History extends Model {}

History.init(
  {
    day: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    loggedUsers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    likedProducts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    orders: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "History",
  }
);

module.exports = History;
