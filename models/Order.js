const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide buyer ID"],
    },
    itemIds: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Item",
        required: [true, "Please provide item IDs"],
      },
    ],
    orderDate: {
      type: Date,
      default: Date.now,
    },
    totalAmount: {
      type: Number,
      required: [true, "Please provide the total amount"],
      min: [0, "Total amount cannot be negative"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
