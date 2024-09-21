const admin = require('../services/firebase');

exports.getAllUsers = async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
    }));

    res.status(200).json({
      status: true,
      message: 'All users retrieved successfully',
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

    const user = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
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
