const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: {
    type: String,
    required: true,
    set(value) {
      const saltRounds = 10; // Adjust as needed
      return bcrypt.hashSync(value, saltRounds);
    },
  },
});

UserSchema.methods.isCorrectPassword = async function (password) {
  // Use async/await for clarity
  return await comparePassword(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
