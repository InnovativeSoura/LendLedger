const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    upiId: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(v);
        },
        message: "Invalid UPI ID",
      },
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
"User",
userSchema
);
