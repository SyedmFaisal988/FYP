const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Crowd = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    created: {
      type: Date,
      required: false,
    },
    selectedItems: {
      type: String,
      required: false,
    },
    quality: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Crowd', Crowd)
