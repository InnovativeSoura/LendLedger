const User = require("../models/User");
const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");
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

// =========================
// Send Email OTP
// =========================
const sendOtp = async (req, res) => {
try {
const { email } = req.body;


if (!email) {
  return res.status(400).json({
    message: "Email is required",
  });
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid email address",
  });
}

const otp = Math.floor(
  100000 + Math.random() * 900000
).toString();

await Otp.deleteMany({ email });

await Otp.create({
  email,
  otp,
  verified: false,
  expiresAt: new Date(
    Date.now() + 5 * 60 * 1000
  ),
});

await sendEmail(
  email,
  "LendLedger OTP Verification",
  <div>
  <h2>Email Verification</h2>
  <p>Your OTP is:</p>
  <h1>{otp}</h1>
  <p>This OTP is valid for 5 minutes.</p>
</div>
);

res.status(200).json({
  success: true,
  message: "OTP sent successfully",
});


} catch (error) {
console.error(error);


res.status(500).json({
  message: error.message,
});


}
};

// =========================
// Verify Email OTP
// =========================
const verifyOtp = async (req, res) => {
try {
const { email, otp } = req.body;


const otpRecord =
  await Otp.findOne({ email });

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

otpRecord.verified = true;
await otpRecord.save();

res.status(200).json({
  success: true,
  message: "Email verified successfully",
});


} catch (error) {
res.status(500).json({
message: error.message,
});
}
};

// =========================
// Register User
// =========================
const registerUser = async (req, res) => {
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
  !phone ||
  !upiId ||
  !password
) {
  return res.status(400).json({
    message: "All fields are required",
  });
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneRegex =
  /^[6-9]\d{9}$/;

const upiRegex =
  /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid email address",
  });
}

if (!phoneRegex.test(phone)) {
  return res.status(400).json({
    message: "Invalid phone number",
  });
}

if (!upiRegex.test(upiId)) {
  return res.status(400).json({
    message: "Invalid UPI ID",
  });
}

const verifiedOtp =
  await Otp.findOne({
    email,
    verified: true,
  });

if (!verifiedOtp) {
  return res.status(400).json({
    message:
      "Please verify your email first",
  });
}

const emailExists =
  await User.findOne({
    email,
  });

if (emailExists) {
  return res.status(400).json({
    message:
      "Email already registered",
  });
}

const phoneExists =
  await User.findOne({
    phone,
  });

if (phoneExists) {
  return res.status(400).json({
    message:
      "Phone already registered",
  });
}

const upiExists =
  await User.findOne({
    upiId,
  });

if (upiExists) {
  return res.status(400).json({
    message:
      "UPI ID already registered",
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

await Otp.deleteMany({
  email,
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
console.error(error);


res.status(500).json({
  message: error.message,
});


}
};

// =========================
// Login User
// =========================
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
    token: generateToken(
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

// =========================
// Get Profile
// =========================
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
