const User = require("../models/User");
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

// Register User
const registerUser = async (req, res) => {
  console.log("REGISTER REQUEST:", req.body);

  try {
    const {
      name,
      email,
      phone,
      upiId,
      password,
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check existing user
    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      upiId,
      password: hashedPassword,
    });

    console.log(
      "USER CREATED:",
      user._id
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      upiId: user.upiId,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  console.log("LOGIN REQUEST:", req.body);

  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (
      user &&
      (await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        upiId: user.upiId,
        token: generateToken(user._id),
      });
    }

    res.status(401).json({
      message: "Invalid credentials",
    });

  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Logged In User Profile
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
        message: "User not found",
      });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error(
      "PROFILE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};