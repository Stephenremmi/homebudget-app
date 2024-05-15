const { internalServerError, invalidUserError, jwtGenerateToken } = require("../utils/utils");
const User = require('../models/User');
const bcrypt = require('bcrypt'); // Assuming bcrypt is installed for password comparison

const authenticate = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) {
      return invalidUserError(res); // User not found
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare password using bcrypt
    if (!isMatch) {
      return invalidUserError(res); // Password mismatch
    }

    const token = jwtGenerateToken(user); // Generate token for the user
    res.status(200).cookie('token', token, { httpOnly: true })
      .json({ user, token });
  } catch (err) {
    internalServerError(res, err.message); // Handle potential errors
  }
};

const extractUserDetails = async (req, res, next) => {
  const email = req.email || req.body.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {      
      return invalidUserError(res); // User not found
    }
    req.user = user; // Store user object on request for potential reuse
    next();
  } catch (err) {
    next(err); // Propagate error through middleware if needed
  }
};

const logout = function (req, res) {
  res.clearCookie("token");
  return res.sendStatus(200);
};

module.exports = { logout, authenticate, extractUserDetails };