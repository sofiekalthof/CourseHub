const mongoose = require("../models/dbConnection.js");

const fileSchema = new mongoose.Schema({
  originalFileName: {
    type: String,
  },
  fileName: {
    type: String,
    required: true,
  },
});

// create mongoose schema
const userTaskStatusSchema = new mongoose.Schema({
  // reference to original task
  originalTaskId: {
    type: mongoose.Types.ObjectId,
    ref: "TaskModel",
  },
  // user's status for the task
  userTaskStatus: {
    type: String,
    enum: ["due", "missed", "done"],
    default: "due",
  },
  userTaskScore: {
    type: Number,
    default: 0,
  },
  uploadedFile: {
    type: fileSchema,
  },
  uploadedAssignmentDescription: {
    type: String,
  },
});

// export schema only, since it is needed for defining the TimelineUser
module.exports = userTaskStatusSchema;
