const jwt = require('jsonwebtoken');
const OtpPresenter = require('../services/OtpPresenter');

const JWT_SECRET = process.env.JWT_SECRET || 'Tosssi@2121';

const verifyOtp = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({
        status: false,
        message: 'Mobile number and OTP are required.',
      });
    }

    const result = await OtpPresenter.verifyOtp({ contactNo: mobileNumber, otp });

    if (result.status === 'success') {
      const token = jwt.sign({ mobileNumber }, JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({
        status: true,
        message: result.message,
        token,
      });
    } else {
      return res.status(401).json({
        status: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error during OTP verification:', error);

    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const checkMobileNumber = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({
        status: false,
        message: 'Mobile number is required.',
      });
    }

    const result = await OtpPresenter.checkMobileNumber(mobileNumber);
    if (result.message === 'OTP has been generated and sent via WhatsApp.') {
      return res.status(200).json({
        status: true,
        message: 'OTP sent successfully via WhatsApp',
        data: result,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: result.message || 'Failed to send OTP',
      });
    }
  } catch (error) {
    console.error('Error during mobile number check:', error);

    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  verifyOtp,
  checkMobileNumber,
};
