module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define(
    'Otp',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      contactNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      otpNumber: {
        type: DataTypes.STRING,
      },
      otpExpiration: {
        type: DataTypes.DATE,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
      tableName: 'Otp',
    }
  );
  // Otp.sync({ alter: true });

  Otp.associate = (models) => {
    Otp.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };
  return Otp;
};
