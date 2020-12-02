const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/user.auth");
const adminAuth = require("../middlewares/admin.auth");
const superAdminAuth = require("../middlewares/superadmin.auth");
const ProductController = require("../controllers/product");

/**
 * Add product
 */
router.post("/add", adminAuth, (req, res) => {
  ProductController.addProduct(req, res);
});
/**
 * Get product by id
 */
router.get("/get/:id", (req, res) => {
  ProductController.getproduct(req, res);
});

/**
 * Get  all product
 */
router.get("/produit", (req, res) => {
  ProductController.getproducts(req, res);
  // res.send(data.products)
});
/**
 * Edit product
 */
router.post("/edit/:id", adminAuth, (req, res) => {
  ProductController.editProduct(req, res);
});
/**
 * Delete product
 */
router.post("/delete/:id", adminAuth, (req, res) => {
  ProductController.deletedproduct(req, res);
});
module.exports = router;
