const Order = require("../models/order");
const historyController = require("./history");
function addOrder(req, res) {
  // add user to database
  var tableproduct = req.body.id;
  var nbproduct = req.body.nb;
  var adress = req.body.address;
  var price = req.body.price;
  //var iduser = req.body.iduser;

  for (let index = 0; index < tableproduct.length; index++) {
    Order.create({
      address: adress,
      clientid: "1",
      idproduct: tableproduct[index],
      nproduct: nbproduct[index],
      state: null,
      price: price[index],
    })
      .then((response) => {
        res.json({
          data: response,
          valid: true,
          message: "order added successfuly",
        });
        historyController.setOrders();
      })
      .catch((err) => {
        let errMsg = [];
        err.errors.map((element) => {
          errMsg.push(element.message);
        });
        res.json({
          valid: false,
          error: errMsg,
        });
      });
  }
}
function getOrders(req, res) {
  const id = req.params.id;
  console.log(id);
  Order.findAll({ where: { clientid: id } })
    .then((response) => {
      if (response) {
        // user found
        res.status(200).json({
          valid: true,
          data: response,
        });
      } else {
        res.status(404).json({
          valid: false,
          error: "User not found",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        valid: false,
        error: "User error",
      });
    });
}
function getOrder(req, res) {
  const iduser = req.params.iduser;
  const iddelivery = req.params.iddelivery;
  Order.findAll({
    where: {
      rank: {
        [Op.or]: {
          iduser: iduser,
          iddelivery: iddelivery,
        },
      },
    },
  })
    .then((response) => {
      if (response) {
        // product found
        res.status(200).json({
          valid: true,
          data: response.dataValues,
        });
      } else {
        res.status(404).json({
          valid: false,
          error: "product not found",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        valid: false,
        error: "product error",
      });
    });
}
function editOrder(req, res) {
  const id = req.params.id;
  var tableproduct = req.params.products;
  var adress = req.body.adress;
  var tablenproduct = req.params.nproducts;
  for (let index = 0; index < idproduct.length; index++) {
    Order.update(
      {
        adress: adress,
        idproduct: tableproduct[index],
        nproduct: tablenproduct[index],
        state: false,
      },
      {
        where: { id: id },
      }
        .then((response) => {
          if (response) {
            // user found
            res.status(200).json({
              valid: true,
              data: response.dataValues,
            });
          } else {
            res.status(404).json({
              valid: false,
              error: "User not found",
            });
          }
        })
        .catch((err) => {
          res.status(404).json({
            valid: false,
            error: "User error",
          });
        })
    );
  }
}

module.exports = {
  addOrder,
  getOrder,
  editOrder,
  getOrders,
};
