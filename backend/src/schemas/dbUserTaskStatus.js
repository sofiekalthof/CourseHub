const dbModule = require("../dbConnection.js");
const mongoose = dbModule.mongoose;

// create mongoose schema
const userTaskSatusSchema = new mongoose.Schema({
  // reference to original task
  originalTaskId: {
    type: mongoose.Types.ObjectId,
    ref: "TaskModel",
  },
  // user's status for the task
  userTaskSatus: {
    type: String,
    enum: ["due", "missed", "done"],
    default: "due",
  },
  userTaskScore: {
    type: Number,
    default: 0,
  },
});

// export schema only, since it is needed for defining the TimelineUser
module.exports = userTaskSatusSchema;
