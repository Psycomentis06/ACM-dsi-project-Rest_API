const Product = require("../models/product");
const { Op } = require("sequelize");
function addProduct(req, res) {
  // add product to database
  var title = req.body.title;
  var price = req.body.price;
  var description = req.body.description;
  var stock = req.body.stock;
  var imageurl = req.body.imageurl;
  var backgroundcolor = req.body.backgroundcolor;

  Product.create({
    title: title,
    price: price,
    description: description,
    imageurl: imageurl,
    backgroundcolor: backgroundcolor,
    stock: stock,
  })
    .then((response) => {
      res.status(200).json({
        data: response,
        valid: true,
        message: "Product added successfuly",
      });
    })
    .catch((err) => {
      let errMsg = [];
      err.errors.map((element) => {
        errMsg.push(element.message);
      });
      res.status(401).json({
        valid: false,
        error: errMsg,
      });
    });
}

function getproducts(req, res) {
  Product.findAll()
    .then((response) => {
      if (response) {
        // user found
        res.status(200).json({
          valid: true,
          data: response,
        });
      } else {
        res.status(500).json({
          valid: false,
          error: "Data error",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        valid: false,
        error: "Product error",
      });
    });
}
function getproduct(req, res) {
  const id = req.params.id;

  Product.findAll({
    where: {
      [Op.or]: {
        title: id,
        id: id,
        category: id,
      },
    },
  })
    .then((response) => {
      if (response) {
        // product found
        res.status(200).json({
          valid: true,
          data: response,
        });
      } else {
        res.status(404).json({
          valid: false,
          error: "Product not found",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        valid: false,
        error: "Product error",
      });
    });
}
function editProduct(req, res) {
  var title = req.body.title;
  var price = req.body.price;
  var description = req.body.description;
  var store = req.body.store;
  var imageurl = req.body.imageurl;
  var backgroundcolor = req.body.backgroundcolor;
  const productid = req.params.id;

  Product.update(
    {
      title: title,
      price: price,
      description: description,
      imageurl: imageurl,
      backgroundcolor: backgroundcolor,
      store: store,
    },
    {
      where: {
        id: productid,
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
              error: "Product not found",
            });
          }
        })
        .catch((err) => {
          res.status(404).json({
            valid: false,
            error: "Product error",
          });
        }),
    }
  );
}
function deletedproduct(req, res) {
  const id = req.params.id;
  Product.destroy({ where: { id: id } })
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
          error: "Product not found",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        valid: false,
        error: "Product error",
      });
    });
}
module.exports = {
  addProduct,
  getproducts,
  getproduct,
  editProduct,
  deletedproduct,
};
