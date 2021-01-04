const express = require("express");
const router = express.Router();
const orderController = require("../controllers/ordre");
const adminAuth = require("../middlewares/admin.auth");

/**
 * Get all orders
 */
router.get("/:id", adminAuth, (req, res) =>
  orderController.getOrders(req, res)
);

/**
 * Get order by user_id
 */
router.get("/:id/:idu", adminAuth, (req, res) =>
  orderController.getOrder(req, res)
);

/**
 * Edit order
 */

router.put("/:id", adminAuth, (req, res) =>
  orderController.editOrder(req, res)
);

module.exports = router;
