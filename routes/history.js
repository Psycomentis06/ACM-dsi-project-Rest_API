const express = require("express");
const router = express.Router();
const historyController = require("../controllers/history");
const adminAuth = require("../middlewares/admin.auth");
const userRole = require("../middlewares/userRole");
/**
 * get History
 */

router.get("/", adminAuth, userRole, (req, res) =>
  historyController.getHistory(req, res)
);

/**
 * get History by month
 */

router.get("/month", adminAuth, userRole, (req, res) =>
  historyController.getHistoryByMonth(req, res)
);

module.exports = router;
