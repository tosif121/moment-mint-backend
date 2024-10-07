const { Post, User, Comment, Like } = require('../models');
const { uploadImageToS3 } = require('../services/s3Service');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { activity } = req.body;
    const userId = req.user.id;

    if (!userId || !activity) {
      return res.status(400).json({ message: 'User ID and activity are required.' });
    }

    let imageUrl = null;
    if (req.file) {
      const s3Result = await uploadImageToS3('posts', req.file);
      imageUrl = s3Result.url;
    }

    // Create a new post
    const newPost = await Post.create({
      userId,
      activity,
      imageUrl,
      likesCount: 0,
    });

    return res.status(201).json({
      message: 'Post created successfully.',
      post: newPost,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

// Get posts for the currently logged-in user
exports.getCurrentUserPosts = async (req, res) => {
  const userId = req.user.id;
  try {
    // Fetch the user's details
    const user = await User.findOne({
      where: { id: userId },
      attributes: [
        'id',
        'email',
        'userName',
        'displayName',
        'profileImg',
        'followingCount',
        'followersCount',
        'streak',
        'coins',
        'mobile',
        'dob',
        'gender',
        'bio',
      ],
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    // Fetch the user's posts
    const posts = await Post.findAll({
      where: { userId },
      include: [
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'user', attributes: ['id', 'userName'] }],
        },
        { model: Like, as: 'likes', attributes: ['userId'] },
      ],
      attributes: {
        include: [['imageUrl', 'image'], 'likesCount'],
      },
      order: [['createdAt', 'DESC']],
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      activity: post.activity,
      imageUrl: post.imageUrl,
      likesCount: post.likesCount,
      comments: post.comments,
    }));

    return res.status(200).json({
      status: true,
      message:
        posts.length > 0
          ? 'User posts fetched successfully'
          : 'No posts found, but user details retrieved successfully',
      data: {
        user,
        posts: formattedPosts,
      },
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return res
      .status(500)
      .json({ status: false, message: 'An error occurred while fetching posts.', error: error.message });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const posts = await Post.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'userName', 'profileImg'] },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'user', attributes: ['id', 'userName'] }],
        },
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
exports.getPostById = async (req, res) => {
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
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { activity } = req.body;
  const userId = req.user.id;

  try {
    const post = await Post.findOne({ where: { id, userId } });
    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found or you are not authorized to update this post',
      });
    }

    // If there's a new image, upload it
    if (req.file) {
      const s3Result = await uploadImageToS3('posts', req.file);
      post.imageUrl = s3Result.url;
    }

    // Update activity text
    await post.update({ activity });
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
exports.deletePost = async (req, res) => {
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
exports.updateLikes = async (req, res) => {
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

    await post.update({ likesCount: likes.length });
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
exports.addComment = async (req, res) => {
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

    const newComment = await Comment.create({ postId: id, content: comment });
    return res.status(200).json({
      status: true,
      message: 'Comment added successfully',
      data: newComment,
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
