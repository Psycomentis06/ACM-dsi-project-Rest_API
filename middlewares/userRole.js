/**
 * Middleware to check if user role changed during his activity or not
 */
const User = require("../models/user");
module.exports = (req, res, next) => {
  User.findByPk(req.params.id)
    .then((response) => {
      if (response === null) {
        res.status(401).json({
          valid: false,
          message: "Auth error",
        });
      } else {
        if (req.body.tokenData.role === response.roles) {
          next();
        } else {
          res.status(401).json({
            valid: false,
            message: "Auth error",
          });
        }
      }
    })
    .catch(() => {
      res.status(401).json({
        valid: false,
        message: "Auth error",
      });
    });
};
