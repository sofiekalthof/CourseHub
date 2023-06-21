const mongoose = require("../dbConnection.js");
const TimelineModel = require("./dbTimeline.js");

// initialize parameters
const collectionName = process.env.DB_COLLECTION_TIMELINEUSERS;

// create mongoose schema
const TimelineUserSchema = new mongoose.Schema({
  origin: {
    type: mongoose.Types.ObjectId,
    ref: "TimelineModel"
  },
  // tasks' status for a user
  usertaskstatus: [
    {
      type: String, 
      enum: ['due', 'missed', 'done'], 
      default: 'due'
    }
  ],
  // tasks' scores for a user
  usertasksscores: [
    {
      type: [Number]
    }
  ],
  // milestones' status for a user
  usermilestonesstatus: [
    {
      type: String, 
      enum: ['due', 'missed', 'done'], 
      default: 'due'
    }
  ]
});

// create model from schema
let TimelineUserModel = mongoose.model(collectionName, schema=TimelineUserSchema);

// export model
module.exports = TimelineUserModel;