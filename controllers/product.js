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
    category: req.body.category,
    discount: req.body.discount,
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
      if (Array.isArray(err.errors)) {
        err.errors.map((element) => {
          errMsg.push(element.message);
        });
      } else {
        errMsg.push(err.message);
      }
      res.status(401).json({
        valid: false,
        error: errMsg,
      });
    });
}

function getProducts(req, res) {
  Product.findAll()
    .then((response) => {
      if (response !== null) {
        // products found
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

  Product.findOne({
    where: {
      id: id,
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
  var stock = req.body.stock;
  var imageurl = req.body.imageurl;
  var backgroundcolor = req.body.backgroundcolor;
  const productid = req.params.id;

  Product.findOne({
    where: {
      id: productid,
    },
  })
    .then((response) => {
      if (response !== null) {
        // user found
        response.title = title;
        response.price = price;
        response.description = description;
        response.imageurl = imageurl;
        response.backgroundcolor = backgroundcolor;
        response.stock = stock;
        response.category = req.body.category;
        response.discount = req.body.discount;
        response
          .save()
          .then((response) => {
            res.status(200).json({
              valid: true,
              message: "Updated",
            });
          })
          .catch((err) => {
            res.status(403).json({
              valid: false,
              error: err.message,
            });
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
  getProducts,
  getproduct,
  editProduct,
  deletedproduct,
};
