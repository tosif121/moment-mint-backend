const { User } = require('../models');

// Create a new user
const createUser = async (req, res) => {
  try {
    const { uid, email, userName, photoURL, bio } = req.body;

    const user = await User.create({
      uid,
      email,
      userName,
      photoURL,
    });

    res.status(200).json({
      status: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json({
      status: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get a user by ID

const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ where: { uid } });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      status: true,
      message: 'User retrieved successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Update a user by ID
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName, photoURL, bio, userName, mobile, dob, gender } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    await user.update({
      displayName: displayName || user.displayName,
      photoURL: photoURL || user.photoURL,
      bio: bio || user.bio,
      userName: userName || user.userName,
      mobile: mobile || user.mobile,
      dob: dob || user.dob,
      gender: gender || user.gender,
    });

    res.status(200).json({
      status: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Delete a user by ID
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    await user.destroy();
    res.status(200).json({
      status: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
