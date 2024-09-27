const { Post } = require('../models');

// Create a new post
async function createPost(postData) {
  try {
    console.log('Creating post with data:', postData); // Add this line for debugging
    const post = await Post.create({
      uid: postData.uid,
      activity: postData.activity,
      imageUrl: postData.imageUrl,
    });
    console.log('Post created:', post); // Add this line for debugging
    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post: ' + error.message);
  }
}

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    return res.status(200).json({
      status: true,
      message: 'Posts fetched successfully',
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
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
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Update a post by ID
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid, activity, imageUrl, likes, comments } = req.body;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }

    // Update the post fields
    post.uid = uid || post.uid;
    post.activity = activity || post.activity;
    post.imageUrl = imageUrl || post.imageUrl;
    post.likes = likes !== undefined ? likes : post.likes; // Handle likes if provided
    post.comments = comments !== undefined ? comments : post.comments; // Handle comments if provided

    await post.save();

    return res.status(200).json({
      status: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Delete a post by ID
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }

    await post.destroy();

    return res.status(200).json({
      status: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Update likes for a post
const updateLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const { likes } = req.body;

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
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Add a comment to a post
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

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
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
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
