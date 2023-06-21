const mongoose = require("../dbConnection.js");

// initialize parameters
const collectionName = process.env.DB_COLLECTION_MILESTONES;

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
  },
  // belonging timeline
  timeline: {
    type: mongoose.Types.ObjectId,
    ref: "TimelineModel"
  }
});

// define model
const MilestoneModel = mongoose.model(collectionName, schema=MilestoneSchema);

// export model
module.exports = MilestoneModel;