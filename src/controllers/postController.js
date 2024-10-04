const { Post, User, Comment, Like, sequelize } = require('../models');
const { uploadImageToS3, deleteFromS3 } = require('../services/s3Service');

const handleError = async (res, error, transaction = null) => {
  if (transaction) {
    await transaction.rollback();
  }
  return res.status(500).json({
    status: false,
    message: 'Internal server error',
    error: error.message,
  });
};

const getPostWithAssociations = async (id, transaction = null) => {
  return Post.findByPk(id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'userName', 'profileImg'],
      },
      {
        model: Comment,
        as: 'comments',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'userName'],
          },
        ],
        order: [['createdAt', 'DESC']],
      },
      {
        model: Like,
        as: 'likes',
        attributes: ['userId'],
      },
    ],
    transaction,
  });
};

// Controller functions
exports.uploadImage = async (req, res) => {
  const {
    file,
    body: { uploadType, activity },
    user: { id: userId },
  } = req;

  // Log input data for debugging
  console.log('File:', file);
  console.log('Upload Type:', uploadType);
  console.log('Activity:', activity);
  console.log('User ID:', userId);

  const folderName = uploadType === 'profile' ? 'profiles' : 'posts';

  const transaction = await sequelize.transaction();
  console.log('Transaction started');

  try {
    // Log S3 upload attempt
    console.log('Uploading image to S3...');
    const uploadResult = await uploadImageToS3(folderName, file, userId);
    console.log('Upload Result:', uploadResult);

    let post = null;
    if (uploadType !== 'profile') {
      // Log post creation attempt
      console.log('Creating post...');
      post = await Post.create(
        {
          userId,
          activity,
          imageUrl: uploadResult.url,
        },
        { transaction }
      );
      console.log('Post created:', post);
    }

    // Commit transaction
    await transaction.commit();
    console.log('Transaction committed successfully');

    return res.status(200).json({
      status: true,
      message: `${uploadType === 'profile' ? 'Profile picture' : 'Post'} uploaded successfully`,
      data: uploadType === 'profile' ? uploadResult : { uploadResult, post },
    });
  } catch (error) {
    console.error('Error occurred:', error); // Log the error for debugging
    return handleError(res, error, transaction); // Handle the error response
  }
};


exports.getFeed = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: posts } = await Post.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'userName', 'profileImg'],
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'userName'],
            },
          ],
          limit: 3,
          order: [['createdAt', 'DESC']],
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['userId'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return res.status(200).json({
      status: true,
      message: 'Feed retrieved successfully',
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          hasNextPage: offset + limit < count,
        },
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await getPostWithAssociations(req.params.id);
    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Post retrieved successfully',
      data: post,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { activity } = req.body;
  const userId = req.user.id;

  const transaction = await sequelize.transaction();

  try {
    const post = await Post.findOne({
      where: { id, userId },
      transaction,
    });

    if (!post) {
      await transaction.rollback();
      return res.status(404).json({
        status: false,
        message: 'Post not found or you are not authorized to update this post',
      });
    }

    await post.update({ activity }, { transaction });
    await transaction.commit();

    const updatedPost = await getPostWithAssociations(id);
    return res.status(200).json({
      status: true,
      message: 'Post updated successfully',
      data: updatedPost,
    });
  } catch (error) {
    return handleError(res, error, transaction);
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const transaction = await sequelize.transaction();

  try {
    const post = await Post.findOne({
      where: { id, userId },
      transaction,
    });

    if (!post) {
      await transaction.rollback();
      return res.status(404).json({
        status: false,
        message: 'Post not found or you are not authorized to delete this post',
      });
    }

    if (post.imageUrl) {
      const key = post.imageUrl.split('.com/')[1];
      await deleteFromS3(key);
    }

    await post.destroy({ transaction });
    await transaction.commit();

    return res.status(200).json({
      status: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    return handleError(res, error, transaction);
  }
};

exports.updateLikes = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const transaction = await sequelize.transaction();

  try {
    const [like, created] = await Like.findOrCreate({
      where: {
        postId: id,
        userId,
      },
      transaction,
    });

    if (!created) {
      await like.destroy({ transaction });
      await Post.decrement('likesCount', { where: { id }, transaction });
    } else {
      await Post.increment('likesCount', { where: { id }, transaction });
    }

    await transaction.commit();
    const updatedPost = await getPostWithAssociations(id);

    return res.status(200).json({
      status: true,
      message: created ? 'Post liked successfully' : 'Post unliked successfully',
      data: updatedPost,
    });
  } catch (error) {
    return handleError(res, error, transaction);
  }
};

exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const transaction = await sequelize.transaction();

  try {
    const post = await Post.findByPk(id, { transaction });
    if (!post) {
      await transaction.rollback();
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }

    const newComment = await Comment.create(
      {
        postId: id,
        userId,
        content,
      },
      { transaction }
    );

    await transaction.commit();

    const updatedPost = await getPostWithAssociations(id);
    return res.status(200).json({
      status: true,
      message: 'Comment added successfully',
      data: updatedPost,
    });
  } catch (error) {
    return handleError(res, error, transaction);
  }
};
