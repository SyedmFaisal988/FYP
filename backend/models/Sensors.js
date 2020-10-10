const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CordsSchema = new Schema({
  x: {
    type: Number,
    required: true,
  }, 
  y: {
    type: Number,
    required: true,
  },
  z: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true
  }
})

const Sensor = new Schema({
    Gyroscope: [CordsSchema],
    Magnetometer: [CordsSchema],
    Accelerometer: [CordsSchema],
    userId: {
        type: String,
        required: true,
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Sensor', Sensor)
