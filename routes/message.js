const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/user.auth");
const adminAuth = require("../middlewares/admin.auth");
const superAdminAuth = require("../middlewares/superadmin.auth");
const messageController = require("../controllers/message");

/**
 * Get chat rooms
 */

router.get("/all", (req, res) => {
  messageController.getRooms(req, res);
});

/**
 * Add room
 */

router.put("/addroom", (req, res) => {
  messageController.addRoom(req, res);
});

module.exports = router;
