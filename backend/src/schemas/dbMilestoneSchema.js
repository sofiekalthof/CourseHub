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

// export model
module.exports = MilestoneSchema;