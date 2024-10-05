module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 30],
        },
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileImg: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      followingCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      followersCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      streak: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,     
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 500],
        },
      },
    },
    {
      timestamps: true,
      tableName: 'Users',
    }
  );

  // Associations
  User.associate = (models) => {
    User.hasMany(models.Post, { foreignKey: 'userId', as: 'posts' });
    User.hasMany(models.Comment, { foreignKey: 'userId', as: 'comments' });
    User.hasMany(models.Like, { foreignKey: 'userId', as: 'likes' });
    
    // Follower and following associations
    User.hasMany(models.Follow, { foreignKey: 'followerId', as: 'following' });
    User.hasMany(models.Follow, { foreignKey: 'followingId', as: 'followers' });
  };

  return User;
};
