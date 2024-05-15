const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  amount: {type: Number, required: true},
  description: {
    type: String,
    trim: true,
  },            
  targetDate: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Goal', GoalSchema);