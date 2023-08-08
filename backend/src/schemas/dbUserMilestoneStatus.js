const mongoose = require("../models/dbConnection.js");

/* The schema `userMilestoneStatusSchema` is used to define the structure and validation rules for 
status of any milestone that user is assigned to. */
const userMilestoneStatusSchema = new mongoose.Schema({
  // reference to original milestone
  originalMilestoneId: {
    type: mongoose.Types.ObjectId,
    ref: "MilestoneModel",
  },
  // user's status for the milestone
  userMilestoneStatus: {
    type: String,
    enum: ["due", "missed", "done"],
    default: "due",
  },
});

// export schema only, since it is needed for defining the TimelineUser
module.exports = userMilestoneStatusSchema;
