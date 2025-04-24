const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  name: { type: String, required: true },
  method: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
});

// Create the model from the schema
const Expense = mongoose.model("Expense", ExpenseSchema);

// Export the model so it can be used in other files
module.exports = Expense;
