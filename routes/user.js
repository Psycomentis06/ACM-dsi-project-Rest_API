const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/user.auth');
const adminAuth = require('../middlewares/admin.auth');
const superAdminAuth = require('../middlewares/superadmin.auth');
const userController = require('../controllers/user');
const User = require('../models/user');

/**
 * Add user
 */

router.post('/add', (req, res) => {
    userController.addUser(req, res);
});

/**
 * Authenticate user
 */

 router.post('/authenticate', (req, res) => {
    userController.authenticate(req, res);
 });

 /**
  * Get user by id
  */

  router.get('/:id', adminAuth, (req, res) => {
    userController.getUser(req, res);
  })

/**
 * Edit user
 */

router.post('/edit/:id', superAdminAuth, (req, res) => {
    res.send('found');
});

/**
 * Delete user
 */

 router.post('/delete/:id', superAdminAuth, (req, res) => {
     res.send('deleted');
 })

module.exports = router;