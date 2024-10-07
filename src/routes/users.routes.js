const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controllers/usersController');

router.post('/createUser', createUser);

router.get('/getAllUsers', getAllUsers);

router.get('/getUserById/:uid', getUserById);

router.post('/updateUser', updateUserById);

router.post('/deleteUser', deleteUserById);

module.exports = router;
