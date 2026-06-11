const User = require("../models/User");
const Otp = require("../models/Otp");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Send OTP
const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await Otp.deleteMany({ phone });

    await Otp.create({
      phone,
      otp,
      expiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ),
    });

    console.log(
      `OTP for ${phone}: ${otp}`
    );

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const otpRecord =
      await Otp.findOne({ phone });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (
      otpRecord.expiresAt <
      new Date()
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (
      otpRecord.otp !== otp
    ) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    await Otp.deleteMany({
      phone,
    });

    res.status(200).json({
      success: true,
      message: "Phone verified",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Register User
const registerUser = async (req, res) => {
  console.log(
    "REGISTER REQUEST:",
    req.body
  );

  try {
    const {
      name,
      email,
      phone,
      upiId,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Please provide all required fields",
      });
    }

    const userExists =
      await User.findOne({
        email,
      });

    if (userExists) {
      return res.status(400).json({
        message:
          "User already exists",
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    const user =
      await User.create({
        name,
        email,
        phone,
        upiId,
        password:
          hashedPassword,
      });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      upiId: user.upiId,
      token: generateToken(
        user._id
      ),
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login User
const loginUser = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (
      user &&
      (await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        upiId: user.upiId,
        token:
          generateToken(
            user._id
          ),
      });
    }

    res.status(401).json({
      message:
        "Invalid credentials",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Profile
const getProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  getProfile,
};