const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  amount: {type: Number, required: true},
  date: {type: Date, required: true},
  type: {type: String, required: true},
  category: {type: String, required: false},
  description: {type: String},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Transaction', TransactionSchema)