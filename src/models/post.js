module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      activity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true, // Changed to allow posts without images
      },
      likesCount: {
        // Renamed from 'likes' for clarity
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      // Removed 'comments' field - we'll create a separate Comment model
    },
    {
      timestamps: true,
      tableName: 'Posts',
    }
  );

  // Associations
  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Post.hasMany(models.Comment, { foreignKey: 'postId', as: 'comments' });
    Post.hasMany(models.Like, { foreignKey: 'postId', as: 'likes' });
  };

  return Post;
};
