module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photoURL: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      followingCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      followersCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      streak: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      coins: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return User;
};
