const mongoose = require("../models/dbConnection.js");

// create mongoose schema
const userMilestoneSatusSchema = new mongoose.Schema({
  // reference to original milestone
  originalMilestoneId: {
    type: mongoose.Types.ObjectId,
    ref: "MilestoneModel",
  },
  // user's status for the milestone
  userMilestoneSatus: {
    type: String,
    enum: ["due", "missed", "done"],
    default: "due",
  },
});

// export schema only, since it is needed for defining the TimelineUser
module.exports = userMilestoneSatusSchema;
