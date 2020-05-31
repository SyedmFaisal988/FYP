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
    isadmin: {
        type: Boolean,
        required: true,
        default: false
    }
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema)