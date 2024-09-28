const { Post, User, Comment, Like } = require('../models');

// Create a new post
const createPost = async (req, res) => {
  const { activity, imageUrl } = req.body;
  const userId = req.user.id; // Assuming you have authentication middleware

  // Validate inputs
  if (!activity || !imageUrl) {
    return res.status(400).json({
      status: false,
      message: 'Activity and imageUrl are required',
    });
  }

  try {
    const post = await Post.create({ userId, activity, imageUrl });
    return res.status(201).json({
      status: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const posts = await Post.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'userName', 'profileImg'] },
        { model: Comment, as: 'comments', include: [{ model: User, as: 'user', attributes: ['id', 'userName'] }] },
        { model: Like, as: 'likes', attributes: ['userId'] },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return res.status(200).json({
      status: true,
      message: 'Posts fetched successfully',
      data: posts,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Post fetched successfully',
      data: post,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Update a post by ID
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { activity, imageUrl } = req.body;
  const userId = req.user.id;

  try {
    const post = await Post.findOne({ where: { id, userId } });
    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found or you are not authorized to update this post',
      });
    }

    await post.update({ activity, imageUrl });
    return res.status(200).json({
      status: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Delete a post by ID
const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findOne({ where: { id, userId } });
    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found or you are not authorized to delete this post',
      });
    }

    await post.destroy();
    return res.status(200).json({
      status: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Update likes for a post
const updateLikes = async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }

    post.likes = likes;
    await post.save();
    return res.status(200).json({
      status: true,
      message: 'Likes updated successfully',
      data: post,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Add a comment to a post
const addComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }

    const updatedComments = [...post.comments, comment];
    post.comments = updatedComments;
    await post.save();
    
    return res.status(200).json({
      status: true,
      message: 'Comment added successfully',
      data: post,
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
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  updateLikes,
  addComment,
};
