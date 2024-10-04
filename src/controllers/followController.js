const { Follow, User } = require('../models');

// Toggle follow/unfollow a user
const toggleFollow = async (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.id; // Assuming you have authentication middleware

    if (followerId === followingId) {
      return res.status(400).json({ status: false, message: 'You cannot follow yourself' });
    }

    const [follow, created] = await Follow.findOrCreate({
      where: { followerId, followingId }
    });

    if (!created) {
      await follow.destroy();
      await User.decrement('followersCount', { where: { id: followingId } });
      await User.decrement('followingCount', { where: { id: followerId } });

      return res.status(200).json({ status: true, message: 'Unfollowed successfully' });
    } else {
      await User.increment('followersCount', { where: { id: followingId } });
      await User.increment('followingCount', { where: { id: followerId } });

      return res.status(200).json({ status: true, message: 'Followed successfully', follow });
    }
  } catch (error) {
    return handleError(res, error);
  }
};

// Get followers of a user
const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const followers = await Follow.findAll({
      where: { followingId: userId },
      include: [{ model: User, as: 'follower', attributes: ['id', 'userName', 'profileImg'] }]
    });

    return res.status(200).json({ status: true, message: 'Followers fetched successfully', data: followers });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get users that a user is following
const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const following = await Follow.findAll({
      where: { followerId: userId },
      include: [{ model: User, as: 'following', attributes: ['id', 'userName', 'profileImg'] }]
    });

    return res.status(200).json({ status: true, message: 'Following fetched successfully', data: following });
  } catch (error) {
    return handleError(res, error);
  }
};

// Helper function to handle errors
const handleError = (res, error) => {
  return res.status(500).json({
    status: false,
    message: 'Internal server error',
    error: error.message,
  });
};

module.exports = {
  toggleFollow,
  getFollowers,
  getFollowing,
};
