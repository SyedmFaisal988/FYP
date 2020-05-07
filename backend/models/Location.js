const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CordsSchema = new Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
})

const Location = new Schema({
    cords: [CordsSchema],
},{
    timestamps: true
})

module.exports = mongoose.model('Location', Location)
