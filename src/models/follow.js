module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    'Follow',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
      tableName: 'Follows',
      indexes: [
        {
          unique: true,
          fields: ['followerId', 'followingId'],
        },
      ],
    }
  );

  Follow.associate = (models) => {
    Follow.belongsTo(models.User, { foreignKey: 'followerId', as: 'follower' });
    Follow.belongsTo(models.User, { foreignKey: 'followingId', as: 'following' });
  };

  return Follow;
};