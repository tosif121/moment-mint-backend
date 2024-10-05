const { Op } = require('sequelize');
const { Otp } = require('../models');
const WhatsAppService = require('./WhatsAppService');

class OtpPresenter {
  async checkMobileNumber(mobileNumber) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    try {
      const [otpEntry, created] = await Otp.findOrCreate({
        where: { contactNo: mobileNumber },
        defaults: {
          otpNumber: otp,
          otpExpiration: otpExpires,
        },
      });

      if (!created) {
        otpEntry.otpNumber = otp;
        otpEntry.otpExpiration = otpExpires;
        await otpEntry.save();
      }

      await this.waitForWhatsAppClientReady();

      await WhatsAppService.sendMessage(mobileNumber, `Your OTP is: ${otp}`);

      return { message: 'OTP has been generated and sent via WhatsApp.', status: 'success' };
    } catch (error) {
      console.error('Error generating OTP:', error);
      return { message: 'Failed to generate OTP: ' + error.message, status: 'error' };
    }
  }

  async verifyOtp({ contactNo, otp }) {
    try {
      const otpEntry = await Otp.findOne({
        where: {
          contactNo: contactNo,
          otpNumber: otp,
          otpExpiration: { [Op.gt]: new Date() },
        },
      });

      if (!otpEntry) {
        return { message: 'Invalid or expired OTP.', status: 'error' };
      }

      return { message: 'OTP verified successfully', status: 'success' };
    } catch (error) {
      console.error('Error in verifying OTP:', error);
      return { message: 'OTP verification failed: ' + error.message, status: 'error' };
    }
  }

  async waitForWhatsAppClientReady() {
    return new Promise((resolve) => {
      const checkReady = () => {
        if (WhatsAppService.isReady) {
          resolve();
        } else {
          setTimeout(checkReady, 1000);
        }
      };
      checkReady();
    });
  }
}

module.exports = new OtpPresenter();
