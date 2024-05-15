const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const withAuth = require("./middleware");
const dotenv = require("dotenv");
const {
  deleteTransaction,
  addCategory,
  addTransaction,
  getCategories,
  getInitialUserData,
  getTransactions,
  deleteCategory,
  updateTransaction,
  updateGoal,
  deleteGoal,
  addGoal,
  getGoals
} = require("./handlers/handlers");

const {  logout, } = require("./handlers/user");
const { internalServerError, jwtGenerateToken, userSerializer, comparePassword } = require("./utils/utils");

const app = express();
dotenv.config({ path: './config/.env.local' });
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected...`);
  } catch (err) {
    console.error(`MongoDB Error: ${err.message}`);
  }
}

connectDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(logger);

app.use(express.static("client/build"));

// app.get("/*", (req, res) => {
//   res.sendFile(__dirname + "/client/build/index.html");
// });

app.post("/api/signup", async function (req, res) {
  const { name, email, password } = req.body;

  const errors = [];
  if (!name) errors.push("Name is required");
  if (!email) errors.push("Email is required");
  if (!password) errors.push("Password is required");

  // TODO: extra check on password regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    errors.push("Password must contain at least one uppercase, lowercase, digit, and special character, and be at least 8 characters long.");
  }
  if (errors.length > 0) return res.status(400).json(errors);

  try {
    const user = new User({ name, email, password });
    const usr = await user.save();
    const token = jwtGenerateToken(userSerializer(usr));

    return res.status(200).cookie('token', token, { httpOnly: true }).json({
      status: 200,
      message: "Registration successful",
      user: userSerializer(usr),
      token,
    });
  } catch (err) {
    const duplicateEmailError = err?.keyPattern?.email === 1;  

    if (duplicateEmailError) return res.status(400).json(["User with this email already exists"])

    return internalServerError(res, "Error registering new user");
  }
});

app.post("/api/login", async function (req, res) {
  const { email, password } = req.body;

  const errors = [];
  if (!email) errors.push("Email is required");
  if (!password) errors.push("Password is required");

  if (errors.length > 0) return res.status(400).json(errors);

  try {
    const user = await User.findOne({ email });

    // No such user/email
    if (!user) return res.status(400).json("Invalid credentials");

    // check if password is correct
    const validPassword = comparePassword(password, user.password);
    if (!validPassword) return res.status(400).json("Invalid credentials!");

    const token = jwtGenerateToken(userSerializer(user));

    return res.status(200).cookie('token', token, { httpOnly: true })
      .json({
        status: 200,
        message: "Login successful",
        user: userSerializer(user),
        token,
      })
  } catch (err) {
    return res.status(400).json("Invalid credentials");
  }
});
app.post("/api/logout", logout);

app.use(withAuth);
// app.use(extractUserDetails);

app.post("/api/add-category", addCategory);
app.post("/api/add-transaction", addTransaction);
app.get("/api/get-initial-data", getInitialUserData);
app.post("/api/get-transactions", getTransactions);
app.post("/api/get-categories", getCategories);
app.post("/api/get-goals", getGoals);
app.post("/api/add-goal", addGoal);
app.post("/api/update-transaction", updateTransaction);
app.post("/api/update-goal", updateGoal);
app.delete("/api/delete-goal/:id", deleteGoal);
app.delete("/api/delete-transaction/:id", deleteTransaction);
app.delete("/api/delete-category/:id", deleteCategory);

app.get("/checkToken", function (req, res) {
  res.sendStatus(200);
});
