const mongoose = require("./dbConnection.js");

// initialize parameters
const collectionName = process.env.DB_COLLECTION_MILESTONES;

/* The schema `MilestoneSchema` is used to store information for a milestone. A task can either be
a Lecture or Exam. */
const MilestoneSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Lecture", "Exam"],
    default: "Lecture",
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  // current status of the milestone
  status: {
    type: String,
    enum: ["due", "missed", "done"],
    default: "due",
  },
  // reference to timeline of the course the milestone is in
  timeline: {
    type: mongoose.Types.ObjectId,
    ref: "TimelineModel",
  },
});

// define model
const MilestoneModel = mongoose.model(
  collectionName,
  (schema = MilestoneSchema)
);

// export model
module.exports = MilestoneModel;
