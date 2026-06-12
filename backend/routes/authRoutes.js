const express = require("express");

const router = express.Router();

const {
registerUser,
loginUser,
getProfile,
sendOtp,
verifyOtp,
} = require("../controllers/authController");

const {
protect,
} = require("../middleware/authMiddleware");

// ================================
// Test Route
// ================================
router.get("/test", (req, res) => {
res.status(200).json({
success: true,
message: "Auth routes working",
});
});

// ================================
// OTP Routes
// ================================

// Send OTP
router.post(
"/send-otp",
sendOtp
);

// Verify OTP
router.post(
"/verify-otp",
verifyOtp
);

// ================================
// Authentication Routes
// ================================

// Register User
router.post(
"/register",
registerUser
);

// Login User
router.post(
"/login",
loginUser
);

// ================================
// Protected Routes
// ================================

// Get User Profile
router.get(
"/profile",
protect,
getProfile
);

module.exports = router;
