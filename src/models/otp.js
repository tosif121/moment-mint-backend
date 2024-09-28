module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define(
    'Otp',
    {
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
    },
    {
      timestamps: true,
      tableName: 'otp_verification',
    }
  );
  // Otp.sync({ alter: true });

  return Otp;
};
