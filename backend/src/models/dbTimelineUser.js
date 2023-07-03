const dbModule = require("../dbConnection.js");
const mongoose = dbModule.mongoose;
const userTaskSatusSchema = require("../schemas/dbUserTaskStatus.js");
const userMilestoneSatusSchema = require("../schemas/dbUserMilestoneStatus.js");

// initialize parameters
const collectionName = process.env.DB_COLLECTION_TIMELINEUSERS;

// create mongoose schema
const TimelineUserSchema = new mongoose.Schema({
  // original timeline
  origin: {
    type: mongoose.Types.ObjectId,
    ref: "TimelineModel",
  },
  // user's id
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "UserModel",
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