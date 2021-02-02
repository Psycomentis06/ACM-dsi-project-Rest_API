const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/user.auth");
const adminAuth = require("../middlewares/admin.auth");
const superAdminAuth = require("../middlewares/superadmin.auth");
const ProductController = require("../controllers/product");
const userRole = require("../middlewares/userRole");
/**
 * Add product
 */
router.post("/add", superAdminAuth, userRole, (req, res) => {
  ProductController.addProduct(req, res);
});

/**
 * Get  all product
 */
router.get("/all", (req, res) => {
  ProductController.getProducts(req, res);
  // res.send(data.products)
});

/**
 * Get product by id
 */
router.get("/:id", (req, res) => {
  ProductController.getproduct(req, res);
});

/**
 * Edit product
 */
router.put("/:id", superAdminAuth, userRole, (req, res) => {
  ProductController.editProduct(req, res);
});
/**
 * Delete product
 */
router.delete("/:id", superAdminAuth, userRole, (req, res) => {
  ProductController.deletedproduct(req, res);
});
module.exports = router;
