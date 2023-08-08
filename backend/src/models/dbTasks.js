const mongoose = require("./dbConnection.js");

// initialize parameters
collectionName = process.env.DB_COLLECTION_TASKS;

/* The schema `fileSchema` is used to define the structure and validation rules for 
files uploaded to backend. */
const fileSchema = new mongoose.Schema({
  // original name of the file (used to give the same name to the downloaded file)
  originalFileName: {
    type: String,
  },
  // name of the file in the backend 'public' folder
  fileName: {
    type: String,
    required: true,
  },
});

/* The schema `TaskSchema` is used to store information for a task. A task can either be
a Quiz or Assignment. */
const TaskSchema = new mongoose.Schema({
  // type of the task
  type: {
    type: String,
    enum: ["Quiz", "Assignment"],
    default: "Quizz",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // due date of the task
  data: {
    type: Date,
    required: true,
  },
  // current status of the task
  status: {
    type: String,
    enum: ["due", "missed", "done"],
    default: "due",
  },
  // all files related to the task
  files: [fileSchema],
  // reference to timeline of the course the task is in
  timeline: {
    type: mongoose.Types.ObjectId,
    ref: "TimelineModel",
  },
  // quiz related fields below
  questions: {
    type: [String],
  },
  answers: {
    type: [[String]],
  },
  // array of correct answers for each question
  correctAnswers: {
    type: [[Number]],
  },
});

// define task
const TaskModel = mongoose.model(collectionName, (schema = TaskSchema));

// export model
module.exports = TaskModel;
