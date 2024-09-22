const admin = require('../services/firebase');
const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
    }));

    await Promise.all(
      users.map(async (user) => {
        await User.upsert(user);
      })
    );

    res.status(200).json({
      status: true,
      message: 'All users retrieved and stored successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request: UID is required',
      });
    }

    const userRecord = await admin.auth().getUser(uid);
    const userFromDB = await User.findOne({ where: { uid } });

    const user = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || null,
      photoURL: userRecord.photoURL || null,
      userName: email.split('@')[0],
      followingCount: userFromDB ? userFromDB.followingCount : 0,
      followersCount: userFromDB ? userFromDB.followersCount : 0,
      streak: userFromDB ? userFromDB.streak : 0,
      coins: userFromDB ? userFromDB.coins : 0,
      bio: userFromDB ? userFromDB.bio : null,
    };

    res.status(200).json({
      status: true,
      message: 'Current user retrieved successfully',
      data: user,
    });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

