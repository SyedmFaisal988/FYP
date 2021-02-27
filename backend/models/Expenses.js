const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    EmployeeId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    vehicle_id: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("expense", ExpenseSchema);
