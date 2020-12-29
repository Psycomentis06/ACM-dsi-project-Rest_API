const express = require("express");
const router = express.Router();
const historyController = require("../controllers/history");
const adminAuth = require("../middlewares/admin.auth");
/**
 * get History
 */

router.get("/", adminAuth, (req, res) =>
  historyController.getHistory(req, res)
);

/**
 * get History by month
 */

router.get("/month", adminAuth, (req, res) =>
  historyController.getHistoryByMonth(req, res)
);

module.exports = router;
