const { Like, Post, Comment, User } = require('../models');

// Toggle like on a post or comment
const toggleLike = async (req, res) => {
  try {
    const { postId, commentId } = req.body;
    const userId = req.user.id; // Assuming you have authentication middleware

    let like;
    if (postId) {
      [like] = await Like.findOrCreate({ where: { userId, postId } });
    } else if (commentId) {
      [like] = await Like.findOrCreate({ where: { userId, commentId } });
    } else {
      return res.status(400).json({ status: false, message: 'Either postId or commentId is required' });
    }

    // If the like already exists, remove it
    if (!like.isNewRecord) {
      await like.destroy();
      
      // Decrement likes count
      if (postId) {
        await Post.decrement('likesCount', { where: { id: postId } });
      } else if (commentId) {
        await Comment.decrement('likesCount', { where: { id: commentId } });
      }

      return res.status(200).json({ status: true, message: 'Like removed successfully' });
    } else {
      // Increment likes count
      if (postId) {
        await Post.increment('likesCount', { where: { id: postId } });
      } else if (commentId) {
        await Comment.increment('likesCount', { where: { id: commentId } });
      }

      return res.status(201).json({ status: true, message: 'Like added successfully', like });
    }
  } catch (error) {
    return handleError(res, error);
  }
};

// Get all likes for a post or comment
const getLikes = async (req, res) => {
  try {
    const { postId, commentId } = req.query;

    let likes;
    if (postId) {
      likes = await Like.findAll({
        where: { postId },
        include: [{ model: User, as: 'user', attributes: ['id', 'userName', 'profileImg'] }],
      });
    } else if (commentId) {
      likes = await Like.findAll({
        where: { commentId },
        include: [{ model: User, as: 'user', attributes: ['id', 'userName', 'profileImg'] }],
      });
    } else {
      return res.status(400).json({ status: false, message: 'Either postId or commentId is required' });
    }

    return res.status(200).json({ status: true, message: 'Likes fetched successfully', data: likes });
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
  toggleLike,
  getLikes,
};
