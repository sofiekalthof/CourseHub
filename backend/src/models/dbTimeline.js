const mongoose = require("../dbConnection.js");

// initialize parameters
const collectionName = process.env.DB_COLLECTION_TIMELINES;

// create mongoose schema
const TimelineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // list of tasks
  tasks: [{
    type: mongoose.Types.ObjectId,
    ref: "TaskModel"
  }],
  // list of other milestones
  milestones: [{
    type: mongoose.Types.ObjectId,
    ref: "MilestoneModel"
  }]
});

// create model from schema
let TimelineModel = mongoose.model(collectionName, schema=TimelineSchema);

// export model
module.exports = TimelineModel;