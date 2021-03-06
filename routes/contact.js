const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/admin.auth");
const contactController = require("../controllers/contact");
const userRole = require("../middlewares/userRole");
/**
 * Add contact
 */
router.post("/", (req, res) => {
  contactController.addContact(req, res);
});
/**
 * Get all contact
 */
router.get("/all", adminAuth, userRole, (req, res) => {
  contactController.getContacts(req, res);
});
/**
 * Get contact by id
 */
router.get("/:id", adminAuth, userRole, (req, res) => {
  contactController.getContact(req, res);
});

/**
 * Set Seen
 */

router.put("/:id/seen", adminAuth, userRole, (req, res) => {
  contactController.setSeen(req, res);
});

module.exports = router;
