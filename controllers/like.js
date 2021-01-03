const Like = require("../models/Like");
const jwt = require("jsonwebtoken");

const { Op } = require("sequelize");
function addLike(req, res) {
  // add product to database
  var clientid = req.body.like.id;
  var productid = req.body.like.idp;

  Like.create({
    clientid: clientid,
    productid: productid,
  })
    .then((response) => {
      res.json({
        data: 1,
        valid: true,
        message: "Like added successfuly",
      });
    })
    .catch((err) => {
      let errMsg = [];
      err.errors.map((element) => {
        errMsg.push(element.message);
      });
      Like.destroy({
        where: {
          [Op.and]: {
            clientid: clientid,
            productid: productid,
          },
        },
      })
        .then((response) => {
          if (response) {
            // Like found
            res.status(200).json({
              valid: true,
              data: "0",
            });
          } else {
            res.status(404).json({
              valid: false,
              error: "Like not found",
            });
          }
        })
        .catch((err) => {
          res.status(404).json({
            valid: false,
            error: "product error",
          });
        });
    });
}

function getLike(req, res) {
  console.log(req.params.id, req.params.idp, "fghfr");
  const clientid = req.params.id;
  const productid = req.params.idp;
  Like.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt", "id", "clientid"],
    },
    where: {
      clientid: clientid,
    },
  })
    .then((response) => {
      console.log(response.length);
      if (response.length > 0) {
        res.json({
          data: response,
          valid: true,
        });
      } else {
        res.json({
          data: "none",
          valid: true,
        });
      }
    })
    .catch((err) => {
      let errMsg = [];
      err.errors.map((element) => {
        errMsg.push(element.message);
      });
      console.log("none");
      res.json({
        data: "none",
        valid: false,
        error: errMsg,
      });
    });
}
function Liked(req, res) {
  console.log(req.params.id, req.params.idp, "fghfr");
  const clientid = req.params.id;
  const productid = req.params.idp;
  Like.findAll({
    where: {
      clientid: clientid,
      productid: productid,
    },
  })
    .then((response) => {
      console.log(response.length);
      if (response.length > 0) {
        res.json({
          data: "red",
          valid: true,
        });
      } else {
        res.json({
          data: "none",
          valid: true,
        });
      }
    })
    .catch((err) => {
      let errMsg = [];
      err.errors.map((element) => {
        errMsg.push(element.message);
      });
      console.log("none");
      res.json({
        data: "none",
        valid: false,
        error: errMsg,
      });
    });
}

module.exports = {
  addLike,
  getLike,
  Liked,
};
