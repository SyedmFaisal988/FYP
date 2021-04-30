const mongoose = require('mongoose')
const Schema = mongoose.Schema

const maintainceSchema = new Schema({
  address: {
      type: String,
      required: true,
  },
  EmployeeId: {
      type: String,
      required: true,
  },
  type1: {
      type: String,
      required: true,
  },
  type2: {
      type: String,
      required: true,
  },
  type3: {
      type: String,
      required: true,
  },
  type4: {
      type: String,
      required: true,
  },
  userId: {
      type: String,
      required: true,
  },
//   complainId: {
//       type: String,
//       required: true,
//   },
}, {
  timestamps: true
})

module.exports = mongoose.model('maintances', maintainceSchema)