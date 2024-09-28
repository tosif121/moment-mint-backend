const express = require('express');
const router = express.Router();
const { verifyOtp, checkMobileNumber } = require('../controllers/otpController');

router.post('/verifyOtp', verifyOtp);

router.post('/checkMobileNumber', checkMobileNumber);

module.exports = router;
