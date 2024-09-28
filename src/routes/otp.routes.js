const express = require('express');
const router = express.Router();
const { verifyOtp, checkMobileNumber } = require('../controllers/otpController');

router.post('/verify-otp', verifyOtp);

router.post('/check-mobile-number', checkMobileNumber);

module.exports = router;
