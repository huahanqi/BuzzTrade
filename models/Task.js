const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, "Please provide task name"],
      maxlength: 100,
    },
    date: {
      type: String,
      required: [true, "Please provide time of this task"],
      maxlength: 50,
    },
    location: {
      type: String,
      required: false,
      default: "NA",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
