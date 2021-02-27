const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VehicleSchema = new Schema(
  {
    modal: {
      type: String,
      required: true,
    },
    restrationNo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("vehicle", VehicleSchema);
