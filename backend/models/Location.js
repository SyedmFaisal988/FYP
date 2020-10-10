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
    image: {
        type: String,
        required: false
    },
    attachments: [{
        type: String,
        required: false,
    }],
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    attachments: [{
        type: String,
        required: false,
    }],
    processing: {
        type: Date,
        required: false
    },
    complete: {
        type: Date,
        required: false
    },
    created: {
        type: Date,
        required: false
    }
})

const Location = new Schema({
    cords: [CordsSchema],
    userId: {
        type: String,
        required: true,
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Location', Location)
