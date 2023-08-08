const mongoose = require("./dbConnection.js");

// initialize parameters
const collectionName = process.env.DB_COLLECTION_COURSES;

/* The schema `CourseSchema` is used to store information for each course. */
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

// create model from schema
let CourseModel = mongoose.model(collectionName, (schema = CourseSchema));

// export model
module.exports = CourseModel;
