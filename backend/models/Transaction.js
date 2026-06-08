const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    personName: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["LEND", "BORROW"],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    description: {
      type: String
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING"
    },

    dueDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Transaction",
  transactionSchema
);