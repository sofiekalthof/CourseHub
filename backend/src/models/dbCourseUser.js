// Many-to-Many relation between a course and its subscribers
const mongoose = require("./dbConnection.js");

// Initialize parameters
const collectionName = process.env.DB_COLLECTION_COURSEUSERS;

// create mongoose schema
const CourseUserSchema = new mongoose.Schema({
  // user taking the course
  subscriber: {
    type: mongoose.Types.ObjectId,
    ref: "UserModel",
  },
  // course that the user takes
  course: {
    type: mongoose.Types.ObjectId,
    ref: "CourseModel",
  },
  // reduced timeline for each subscriber of any course with information on scores, completion status etc.
  userTimeline: {
    type: mongoose.Types.ObjectId,
    ref: "TimelineUserModel",
  },
});

// create model from schema
let CourseUserModel = mongoose.model(
  collectionName,
  (schema = CourseUserSchema)
);

// export model
module.exports = CourseUserModel;
