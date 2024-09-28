module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
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
      postId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Posts',
          key: 'id',
        },
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Comments',
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
      tableName: 'Likes',
      indexes: [
        {
          unique: true,
          fields: ['userId', 'postId', 'commentId'],
        },
      ],
    }
  );

  Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Like.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
    Like.belongsTo(models.Comment, { foreignKey: 'commentId', as: 'comment' });
  };

  return Like;
};