const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/admin.auth");
const contactController = require("../controllers/contact");

/**
 * Add contact
 */
router.post("/", (req, res) => {
  contactController.addContact(req, res);
});
/**
 * Get all contact
 */
router.get("/all", adminAuth, (req, res) => {
  contactController.getContacts(req, res);
});
/**
 * Get contact by id
 */
router.get("/:id", adminAuth, (req, res) => {
  contactController.getContacts(req, res);
});

/**
 * Set Seen
 */

router.put("/:id/seen", adminAuth, (req, res) => {
  contactController.setSeen(req, res);
});

module.exports = router;
