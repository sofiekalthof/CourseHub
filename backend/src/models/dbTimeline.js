const mongoose = require("./dbConnection.js");

// initialize parameters
const collectionName = process.env.DB_COLLECTION_TIMELINES;

/* The schema `TimelineSchema` is used to store tasks and milestones of a course. */
const TimelineSchema = new mongoose.Schema({
  // list of tasks
  tasks: [
    {
      type: mongoose.Types.ObjectId,
      ref: "TaskModel",
    },
  ],
  // list of other milestones
  milestones: [
    {
      type: mongoose.Types.ObjectId,
      ref: "MilestoneModel",
    },
  ],
});

// create model from schema
let TimelineModel = mongoose.model(collectionName, (schema = TimelineSchema));

// export model
module.exports = TimelineModel;
