const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/admin.auth");
const contactController = require("../controllers/contact");

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
