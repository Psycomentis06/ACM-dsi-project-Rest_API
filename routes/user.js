const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/user.auth");
const adminAuth = require("../middlewares/admin.auth");
const superAdminAuth = require("../middlewares/superadmin.auth");
const userController = require("../controllers/user");
const User = require("../models/user");

/**
 * Add user
 */

router.post("/add", (req, res) => {
  userController.addUser(req, res);
});

/**
 *  Get users
 */

router.get("/all", (req, res) => {
  userController.getUsers(req, res);
});

/**
 * Authenticate user
 */

router.post("/authenticate", (req, res) => {
  userController.authenticate(req, res);
});

/**
 * Get user by id
 */

router.get("/:id", adminAuth, (req, res) => {
  userController.getUser(req, res);
});

/**
 * Edit user
 */

router.put("/:id" /*, superAdminAuth*/, (req, res) => {
  userController.setUser(req, res);
});

/**
 * Edit user password
 */

router.put(
  "/:id/password",
  /* userAuth ,*/ (req, res) => {
    userController.setPassword(req, res);
  }
);

/**
 * Reset password
 */

router.put("/:id/password/reset", (req, res) => {
  userController.resetPassword(req, res);
});

/**
 * Get user password is verification key
 */

router.post("/:id/password", (req, res) => {
  userController.getPasswordVkey(req, res);
});

/**
 * Validate user account
 */

router.put("/:id/verify", (req, res) => {
  userController.activateUser(req, res);
});

/**
 * Delete user
 */

router.delete("/:id" /*, superAdminAuth*/, (req, res) => {
  userController.deleteUser(req, res);
});

/**
 * Add phone
 */

router.put("/:id/phone", (req, res) => {
  userController.addPhone(req, res);
});

/**
 * Add bio
 */

router.put("/:id/bio", (req, res) => {
  userController.addBio(req, res);
});

/**
 * Add Address city and country
 */

router.put("/:id/address", (req, res) => {
  userController.addAddress(req, res);
});

/**
 * Set role
 */

router.put("/:id/roles", (req, res) => {
  userController.setRoles(req, res);
});

/**
 * Set status
 */

router.put("/:id/status", (req, res) => {
  userController.setStatus(req, res);
});

module.exports = router;
