const express = require('express');
const router = express.Router();
const { getCurrentUser, getAllUsers } = require('../controllers/usersController');

router.get('/users', getAllUsers);
router.get('/users/:uid', getCurrentUser);

module.exports = router;