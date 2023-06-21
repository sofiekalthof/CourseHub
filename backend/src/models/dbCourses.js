const mongoose = require("../dbConnection.js");
const TaskModel = require("./dbTasks.js");
const Milestone = require("../schemas/dbMilestones.js");
const UserModel = require("./dbUsers.js");

// Initialize parameters
const collectionName = process.env.DB_COLLECTION_COURSES;

// create mongoose schema
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  // list of tasks for the course
  tasks: [{
    type: mongoose.Types.ObjectId, 
    ref: "TaskModel"
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
let CourseModel = mongoose.model(collectionName, schema=CourseSchema);

// export model
module.exports = CourseModel;