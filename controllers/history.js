const { like } = require("sequelize/types/lib/operators");
const History = require("../models/history");

/**
 * Add day to database
 */

function addDay({ users = 0, likes = 0, orders = 0 }) {
  History.findOne({ where: { day: new Date().toLocaleDateString() } })
    .then((response) => {
      if (response !== null) {
        return false; // day already declared in db
      } else {
        History.create({
          loggedUsers: users > 0 ? users : 0,
          likedProducts: likes > 0 ? likes : 0,
          orders: orders > 0 ? orders : 0,
        })
          .then((response) => {
            return true;
          })
          .catch((err) => {
            return false;
          });
      }
    })
    .catch((err) => {
      return false;
    });
}

/**
 * set Users
 */

function setUsers() {
  History.findOne({ where: { day: new Date().toLocaleDateString() } })
    .then((response) => {
      if (response === null) {
        // no date added so we create new day
        addDay({ users: 1 });
      } else {
        // day exist we increment it
        response
          .increment("loggedUsers") // increment by 1
          .then((response) => {
            return true;
          })
          .catch((err) => {
            return false;
          });
      }
    })
    .catch((err) => {
      return false;
    });
}

/**
 * Set
 */

module.exports = {
  addDay,
};
