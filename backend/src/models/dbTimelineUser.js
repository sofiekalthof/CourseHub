const mongoose = require("./dbConnection.js");
const userTaskStatusSchema = require("../schemas/dbUserTaskStatus.js");
const userMilestoneStatusSchema = require("../schemas/dbUserMilestoneStatus.js");

// initialize parameters
const collectionName = process.env.DB_COLLECTION_TIMELINEUSERS;

/* The schema `TimelineUserSchema` is used to store status of tasks and milestones for a user. */
const TimelineUserSchema = new mongoose.Schema({
  // reference to original timeline
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
      type: userTaskStatusSchema,
    },
  ],
  // milestones' status for a user
  userMilestonesStats: [
    {
      type: userMilestoneStatusSchema,
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
