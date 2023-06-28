const mongoose = require("../dbConnection.js");
const userTaskSatusSchema = require("../schemas/dbUserTaskStatus.js");
const userMilestoneSatusSchema = require("../schemas/dbUserMilestoneStatus.js");

// initialize parameters
const collectionName = process.env.DB_COLLECTION_TIMELINEUSERS;

// create mongoose schema
const TimelineUserSchema = new mongoose.Schema({
  origin: {
    type: mongoose.Types.ObjectId,
    ref: "TimelineModel",
  },
  // tasks' status for a user
  userTasksStats: [
    {
      type: userTaskSatusSchema,
    },
  ],
  // milestones' status for a user
  userMilestonesStats: [
    {
      type: userMilestoneSatusSchema,
    },
  ],
});

// create model from schema
let TimelineUserModel = mongoose.model(
  collectionName,
  (schema = TimelineUserSchema)
);

// export model
module.exports = TimelineUserModel;
