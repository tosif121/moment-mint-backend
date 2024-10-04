const { Op } = require('sequelize');
const { Otp } = require('../models');
const WhatsAppService = require('./WhatsAppService'); // Ensure correct path to WhatsAppService

class OtpPresenter {
  // Method to check mobile number and generate OTP
  async checkMobileNumber(mobileNumber) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    try {
      const [otpEntry, created] = await Otp.findOrCreate({
        where: { contactNo: mobileNumber },
        defaults: {
          otpNumber: otp,
          otpExpiration: otpExpires,
        },
      });

      // If the entry already exists, update the OTP
      if (!created) {
        otpEntry.otpNumber = otp;
        otpEntry.otpExpiration = otpExpires;
        await otpEntry.save();
      }

      // Wait for WhatsApp client to be ready before sending OTP
      await this.waitForWhatsAppClientReady();

      // Send OTP via WhatsApp
      await WhatsAppService.sendMessage(mobileNumber, `Your OTP is: ${otp}`);
      
      return { message: 'OTP has been generated and sent via WhatsApp.' };
    } catch (error) {
      console.error('Error generating OTP:', error);
      throw new Error('Failed to generate OTP: ' + error.message);
    }
  }

  // Method to verify OTP
  async verifyOtp({ contactNo, otp }) {
    try {
      const otpEntry = await Otp.findOne({
        where: {
          contactNo: contactNo,
          otpNumber: otp,
          otpExpiration: { [Op.gt]: new Date() }, // Check if OTP is valid
        },
      });

      if (!otpEntry) {
        throw new Error('Invalid or expired OTP.');
      }

      // OTP is valid
      return { message: 'OTP verified successfully', status: 'success' };
    } catch (error) {
      console.error('Error in verifying OTP:', error);
      throw new Error('OTP verification failed: ' + error.message);
    }
  }

  // Helper method to wait for WhatsApp client readiness
  async waitForWhatsAppClientReady() {
    return new Promise((resolve, reject) => {
      const checkReady = () => {
        if (WhatsAppService.isReady) {
          resolve();
        } else {
          setTimeout(checkReady, 1000); // Check again after 1 second
        }
      };
      checkReady();
    });
  }
}

module.exports = new OtpPresenter();