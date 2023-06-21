const mongoose = require("../dbConnection.js");
const File = require("../schemas/dbFileUploadSchema.js")

// Initialize parameters
const collectionName = "tasks";

// create mongoose schema
const TaskSchema = new mongoose.Schema({
  type: {
    type: String, 
    enum: ['Quizz', 'Assignment'], 
    default: 'Quizz',
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  due: {
    type: Date,
    required: true
  },
  questions: {
    type: [String]
  },
  answers: {
    type: [String]
  },
  // array of correct answers for each question
  correctAnswers: {
    type: [[Number]]
  },
  // for any images 
  files: {
    type: File
  }
});

// create model from schema
let TaskModel = mongoose.model(collectionName, schema=TaskSchema);

// export model
module.exports = TaskModel;