const mongoose = require("../models/dbConnection.js");

/* The schema `fileSchema` is used to define the structure and validation rules for 
files uploaded to backend. */
const fileSchema = new mongoose.Schema({
  // original name of the file (used to give the same name to the downloaded file)
  originalFileName: {
    type: String,
  },
  // name of the file in the backend 'public' folder
  fileName: {
    type: String,
    required: true,
  },
});

/* The schema `userTaskStatusSchema` is used to define the structure and validation rules for 
status of any task that user is assigned to. */
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
  // score from the task (future feature)
  userTaskScore: {
    type: Number,
    default: 0,
  },
  // any file uploaded for an assignment
  uploadedFile: {
    type: fileSchema,
  },
  // description of the submitted assignment
  uploadedAssignmentDescription: {
    type: String,
  },
});

// export schema only, since it is needed for defining the TimelineUser
module.exports = userTaskStatusSchema;
