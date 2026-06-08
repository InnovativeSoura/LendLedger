const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    paymentMode: {
      type: String,
      default: "UPI"
    },

    paymentDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);