const mongoose = require("../dbConnection.js");

// create mongoose schema
const MilestoneSchema = new mongoose.Schema({
  type: {
    type: String, 
    enum: ['Lecture', 'Exercise', 'Exam'], 
    default: 'Lecture',
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
  }
});

// define model
const MilestoneModel = mongoose.model(collectionName, schema=MilestoneSchema);

// export model
module.exports = MilestoneModel;