const dbModule = require("../dbConnection.js");
const mongoose = dbModule.mongoose;

// initialize parameters
const collectionName = process.env.DB_COLLECTION_TIMELINES;

// create mongoose schema
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
