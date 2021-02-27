const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        default: ''
    },
    email: {
        type: String,
        required: true,
        default: ''
    },
    address: {
        type: String,
        required: true,
        default: ''
    },
    rewardPoint: {
        default: 0,
        type: Number,
        required: true,
    },
    isadmin: {
        type: Boolean,
        required: true,
        default: false
    },
    type: {
        type: String,
        default: 'USER'
    }
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema)