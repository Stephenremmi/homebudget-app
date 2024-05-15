const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Goal = require("../models/Goal");
const { internalServerError } = require("../utils/utils");

const getInitialUserData = async (req, res) => {
  const user = req.user; // Assuming user is populated from middleware

  try {
    const [categories, transactions] = await Promise.all([
      Category.find({ user: user.id }),
      Transaction.find({ user: user.id }),
    ]);

    res.status(200).json({
      email: user.email,
      name: user.name,
      transactions,
      categories,
    });
  } catch (err) {
    internalServerError(res, "Error fetching user data");
  }
};

const getTransactions = async (req, res) => {
  const { startDate, endDate } = req.body;

  const query = {};
  if (startDate) {
    query.date = { $gte: startDate }
  }

  if (endDate) {
    if (query.date)
      query.date["$lte"] = endDate;
    else
      query.date = { $lte: endDate }
  }

  try {
    const user = await User.findById(req.user.id);
    const transactions = await Transaction.find(
      {
        user: user._id,
        ...query,
      },
    );
    
    console.log(transactions);

    return res.status(200)
      .json({ email: req.user.email, name: req.user.name, transactions: transactions });
  } catch (err) {
    console.log(err);
    return internalServerError(res, "Unable to get transactions");
  }
};

const getCategories = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is sent in the request body

    // Check if userId is provided
    if (!userId) {

      return res.status(400).json({ message: "Missing user ID" });
    }

    // Find categories for the user
    const categories = await Category.find({ user: userId });

    // Respond with success and retrieved categories
    res.status(200).json({
      email: req.user.email,
      name: req.user.name || "", // Access user.name if it exists, use empty string otherwise
      categories,
    });
  } catch (error) {
    console.error(error);
    internalServerError(res, "Unable to get categories");
  }
};

const addTransaction = async (req, res) => {
  console.log(req.user);

  const { amount, date, type, category, description } = req.body;

  try {
    const transaction = await Transaction.create({
      amount: amount,
      date: new Date(date),
      type: type,
      category: category,
      description: description,
      user: req.user.id,
    });

    return res.status(200).json(transaction);
  } catch (err) {
    return res.status(400).json("Failed to add transaction");
  }
};

const addCategory = async (req, res) => {
  try {
    const { type, name } = req.body;

    // Create a new category document
    const category = await Category.create({
      name,
      type,
      user: req.user.id // Assuming user object already contains relevant information
    });

    // Fetch all categories after creating a new one
    const categories = await Category.find({ user: req.user.id });

    res.status(200).json(categories); // Send the array of all categories
  } catch (error) {
    console.error(error);
    internalServerError(res, "Error creating category");
  }
};

const updateTransaction = async (req, res) => {
  const { id, amount, date, type, category, description } = req.body;

  try { 
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.amount = amount;
    transaction.date = new Date(date);
    transaction.type = type;
    transaction.category = category;
    transaction.description = description;

    await transaction.save();

    res.sendStatus(200);
  } catch (error) {
    // Handle general errors
    internalServerError(res, "Unable to update transaction");
    console.error(error); 
  }
};

const  deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    await Transaction.deleteOne({ _id: id });
    res.sendStatus(200);
  } catch (error) {
    internalServerError(res, "Unable to remove transaction");
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    await category.deleteOne();
    res.sendStatus(200);
  } catch (error){
    console.log(error);
    internalServerError(res, "Unable to remove category");
  }
};
const addGoal = async (req, res) => {
  try {
    const { amount, description, targetDate } = req.body;

    // Validate user ID (adjust based on your authentication setup)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    const newGoal = new Goal({
      amount,
      description,
      targetDate: targetDate ? new Date(targetDate) : null, // Handle optional targetDate
      user: req.user.id,
    });

    const savedGoal = await newGoal.save();
    return res.status(201).json(savedGoal); // Created (201) status with the saved goal data
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' }); // Handle errors more gracefully
  }
};
const getGoals = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is accessible

    // Check for user ID
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    const goals = await Goal.find({ user: userId });

    // Extract relevant fields from goals array
    const goalData = goals.map(goal => ({
      amount: goal.amount,
      description: goal.description,
      targetDate: goal.targetDate.toLocaleDateString('en-GB'), 
      id:goal._id
      // Add other fields as needed
    }));

    res.status(200).json(goalData);
  } catch (error) {
    console.error(error);
    internalServerError(res, "Unable to fetch goals");
  }
};
const updateGoal = async (req, res) => {
  try {
    const { id, amount, description, targetDate } = req.body;

    const goal = await Goal.findById(id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Update goal properties
    goal.amount = amount;
    goal.title = title;
    goal.description = description;
    goal.targetDate = targetDate ? new Date(targetDate) : null; // Handle optional targetDate

    await goal.save();

    res.status(200).json(goal);
  } catch (error) {
    console.error(error);
    internalServerError(res, "Unable to update goal");
  }
};

const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const goal = await Goal.findByIdAndDelete(id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.sendStatus(200); // No content needed in response
  } catch (error) {
    console.error("Error deleting goal:", error);
    internalServerError(res, "Unable to delete goal");
  }
};  

module.exports = {
  getInitialUserData,
  getTransactions,
  getCategories,
  addTransaction,
  addCategory,
  updateTransaction,
  deleteTransaction,
  deleteCategory,
  updateGoal, 
  deleteGoal,
  addGoal,
  getGoals
};
