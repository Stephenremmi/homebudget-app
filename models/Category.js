const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  type: {type: String, required: true},
  name: {type: String, required: true},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Category', CategorySchema);