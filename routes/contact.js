const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/user.auth");
const adminAuth = require("../middlewares/admin.auth");
const superAdminAuth = require("../middlewares/superadmin.auth");
const contactController = require("../controllers/contact");
const contact = require("../models/Contact");

/**
 * Add contact
 */
router.post("/add", (req, res) => {
  contactController.addContact(req, res);
});
/**
 * Get all contact
 */
router.get("/contact", adminAuth, (req, res) => {
  contactController.getContacts(req, res);
});
/**
 * Get contact by id
 */
router.get("get/:id", adminAuth, (req, res) => {
  contactController.getContacts(req, res);
});

module.exports = router;
