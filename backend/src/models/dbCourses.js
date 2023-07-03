const dbModule = require("../dbConnection.js");
const mongoose = dbModule.mongoose;
const TimelineModel = require("./dbTimeline.js");
const UserModel = require("./dbUsers.js");

// Initialize parameters
const collectionName = process.env.DB_COLLECTION_COURSES;

// create mongoose schema
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // default timeline for a course
  timeline: {
    type: mongoose.Types.ObjectId,
    ref: "TimelineModel",
  },
  // owner of the course
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "UserModel",
  },
});

// // define index to allow full-text search over name and description fields
// CourseSchema.index({name: "text", desc: "text"});

// create model from schema
let CourseModel = mongoose.model(collectionName, (schema = CourseSchema));

// export model
module.exports = CourseModel;
