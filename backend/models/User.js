const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      trim: true,
      default: "",
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit mobile number",
      ],
    },

    upiId: {
      type: String,
      required: [true, "UPI ID is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(
            value
          );
        },
        message:
          "Please enter a valid UPI ID (e.g. soura@paytm)",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);