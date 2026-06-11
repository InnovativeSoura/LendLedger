const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  sendOtp,
  verifyOtp,
} = require(
  "../controllers/authController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth routes working",
  });
});

// OTP Routes
router.post(
  "/send-otp",
  sendOtp
);

router.post(
  "/verify-otp",
  verifyOtp
);

// Authentication Routes
router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

// Protected Route
router.get(
  "/profile",
  protect,
  getProfile
);

module.exports = router;