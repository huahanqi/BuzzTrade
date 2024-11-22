const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide item name"],
      maxlength: 100,
    },
    price: {
      type: Number,
      required: [true, "Please provide price"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Please provide item description"],
      maxlength: 500,
    },
    category: {
      type: String,
      required: [true, "Please provide category"],
      maxlength: 50,
    },
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available", // Default status is "available"
    },
    condition: {
      type: String,
      enum: ["new", "like new", "used", "for parts"],
      required: [true, "Please specify the condition of the item"],
    },
    datePosted: {
      type: Date,
      default: Date.now, // Automatically sets the date when the item is created
    },
    sellerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide seller ID"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
