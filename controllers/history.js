const { Op } = require("sequelize");
const History = require("../models/history");

/**
 * Add day to database
 */

function addDay(users = 0, likes = 0, orders = 0) {
  History.findOne({ where: { day: new Date().toLocaleDateString() } })
    .then((response) => {
      if (response !== null) {
        return false; // day already declared in db
      } else {
        History.create({
          day: new Date().toLocaleDateString(),
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
        return addDay(1);
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
 * Set Likes
 */

function setLikes(action) {
  if (action !== "increment" && action !== "decrement") {
    return false;
  }
  History.findOne({ where: { day: new Date().toLocaleDateString() } })
    .then((response) => {
      if (response === null) {
        if (action === "increment") {
          return addDay(0, 1);
        } else {
          return addDay();
        }
      } else {
        // perform action based on action
        if (action === "increment") {
          // increment
          response
            .increment("likedProducts")
            .then(() => {
              return true;
            })
            .catch(() => {
              return false;
            });
        } else {
          if (response.likedProducts === 0) {
            // can't allow negative value
            return false;
          } else {
            response
              .decrement("likedProducts")
              .then(() => {
                return true;
              })
              .catch(() => {
                return false;
              });
          }
        }
      }
    })
    .catch((err) => {
      return false;
    });
}

/**
 *  Set orders
 */

function setOrders() {
  History.findOne({ where: { day: new Date().toLocaleDateString() } })
    .then((response) => {
      if (response === null) {
        addDay(0, 0, 1);
      } else {
        response
          .increment("orders")
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });
      }
    })
    .catch(() => {
      return false;
    });
}

/**
 * Get history
 * Return history data for today by default
 */

function getHistory(req, res) {
  const day = req.query.date;
  let dateToFind = "";
  if (day !== undefined && day !== null) {
    dateToFind = new Date(day).toLocaleDateString();
  } else {
    dateToFind = new Date().toLocaleDateString();
  }
  History.findOne({ where: { day: dateToFind } })
    .then((response) => {
      if (response === null) {
        // return response based on day value if it's for today or chosen by user
        res.status(404).json({
          valid: false,
          message: "Invalid date",
        });
        if (day !== undefined && day !== null) {
        } else {
          res.status(200).json({
            valid: true,
            message: "No data for today",
          });
        }
      } else {
        res.status(200).json({
          valid: true,
          data: response.dataValues,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        valid: false,
        error: "Get history error",
      });
    });
}

/**
 * Get history by month
 * Return month histories by month or return current month by default
 */

function getHistoryByMonth(req, res) {
  const day = req.query.date;
  let date = new Date();
  if (day !== undefined && day !== null) {
    date = new Date(day);
  }

  History.findAll({
    where: {
      day: {
        [Op.between]: [
          date.getFullYear() + "-" + (date.getMonth() + 1) + "-1",
          date.getFullYear() + "-" + (date.getMonth() + 1) + "-31",
        ],
      },
    },
  })
    .then((response) => {
      res.status(200).json({
        valid: true,
        data: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        valid: false,
        error: err.message,
      });
    });
}

module.exports = {
  addDay,
  setUsers,
  setLikes,
  setOrders,
  getHistory,
  getHistoryByMonth,
};
