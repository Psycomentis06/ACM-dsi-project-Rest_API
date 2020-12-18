const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/user.auth");
const adminAuth = require("../middlewares/admin.auth");
const superAdminAuth = require("../middlewares/superadmin.auth");
const ProductController = require("../controllers/product");

/**
 * Add product
 */
router.post("/add", superAdminAuth, (req, res) => {
  ProductController.addProduct(req, res);
});
/**
 * Get product by id
 */
router.get("/:id", (req, res) => {
  ProductController.getproduct(req, res);
});

/**
 * Get  all product
 */
router.get("/all", (req, res) => {
  ProductController.getProducts(req, res);
  // res.send(data.products)
});
/**
 * Edit product
 */
router.put("/:id", superAdminAuth, (req, res) => {
  ProductController.editProduct(req, res);
});
/**
 * Delete product
 */
router.delete("/:id", superAdminAuth, (req, res) => {
  ProductController.deletedproduct(req, res);
});
module.exports = router;
