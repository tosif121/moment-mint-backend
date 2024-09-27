module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      activity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      comments: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false,
      },
      // Foreign key for User
      uid: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'uid',
        },
      },
    },
    {
      timestamps: true,
      tableName: 'Posts',
    }
  );
  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'uid', as: 'user' });
  };
  return Post;
};