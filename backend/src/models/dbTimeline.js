const mongoose = require("../dbConnection.js");
const Task = require("../schemas/dbTasks.js");
const Milestone = require("../schemas/dbMilestones.js");

// Initialize parameters
const collectionName = process.env.DB_COLLECTION_COURSES;

// create mongoose schema
const TimelineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  // list of tasks
  tasks: [{
    type: Task
  }],
  // list of other milestones
  milestones: [{
    type: Milestone
  }],
  // owner of the course
  owner: [{
    type: mongoose.Types.ObjectId, 
    ref: "UserModel"
  }]
});

// create model from schema
let TimelineModel = mongoose.model(collectionName, schema=TimelineSchema);

// export model
module.exports = TimelineModel;