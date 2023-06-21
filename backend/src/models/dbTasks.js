const mongoose = require("../dbConnection.js");
const File = require("../schemas/dbFileUploadSchema.js");

// initialize parameters
collectionName = process.env.DB_COLLECTION_TASKS;

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
  status: {
    type: String, 
    enum: ['due', 'missed', 'done'], 
    default: 'due'
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
  },
  // belonging timeline
  timeline: {
    type: mongoose.Types.ObjectId,
    ref: "TimelineModel"
  }
});

// define task
const TaskModel = mongoose.model(collectionName, schema=TaskSchema);

// export model
module.exports = TaskModel;