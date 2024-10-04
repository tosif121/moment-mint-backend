const { Comment, User } = require('../models');

// Create a new comment
const createComment = async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user.id; // Assuming you have authentication middleware

  // Validate inputs
  if (!postId || !content) {
    return res.status(400).json({
      status: false,
      message: 'postId and content are required',
    });
  }

  try {
    const comment = await Comment.create({ postId, userId, content });
    return res.status(200).json({
      status: true,
      message: 'Comment created successfully',
      data: comment,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get all comments for a post
const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.findAll({
      where: { postId },
      include: [{ model: User, as: 'user', attributes: ['id', 'userName', 'profileImg'] }],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      status: true,
      message: 'Comments fetched successfully',
      data: comments,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Update a comment by ID
const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const comment = await Comment.findOne({ where: { id, userId } });
    if (!comment) {
      return res.status(404).json({
        status: false,
        message: 'Comment not found or you are not authorized to update this comment',
      });
    }

    await comment.update({ content });
    return res.status(200).json({
      status: true,
      message: 'Comment updated successfully',
      data: comment,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Delete a comment by ID
const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const comment = await Comment.findOne({ where: { id, userId } });
    if (!comment) {
      return res.status(404).json({
        status: false,
        message: 'Comment not found or you are not authorized to delete this comment',
      });
    }

    await comment.destroy();
    return res.status(200).json({
      status: true,
      message: 'Comment deleted successfully',
    });
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
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
