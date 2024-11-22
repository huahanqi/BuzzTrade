const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide sender ID"],
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide receiver ID"],
    },
    message: {
      type: String,
      required: [true, "Please provide a message"],
      maxlength: 1000, // Optional: Limit message length to 1000 characters
    },
    timeStamp: {
      type: Date,
      default: Date.now, // Automatically sets the current date and time when the message is created
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
