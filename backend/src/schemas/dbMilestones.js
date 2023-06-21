const mongoose = require("../dbConnection.js");

// create mongoose schema
const MilestoneSchema = new mongoose.Schema({
  type: {
    type: String, 
    enum: ['Lecture', 'Exercise', 'Exam'], 
    default: 'Lecture',
    required: true
  },
  due: {
    type: Date,
    required: true
  }
});

// export model
module.exports = MilestoneSchema;