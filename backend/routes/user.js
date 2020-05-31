const express = require('express');
const passport = require('passport');
const authenticate = require('../authenticate')
const User = require('../models/User')

const userRouter = express.Router();
userRouter.use(express.json())


userRouter.route('/signup').post(async (req, res)=>{
    const { body: { username, password, email } } = req
    try {
        const user = await User.findOne({ email });
        if(user){
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            return res.json({ message: `${email} is already in use` })
        }else{
            await User.register(new User({
                username,
                email,
            }), password)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({ message: 'signup successful' })
        }
    }
    catch(err){
        console.log(err)
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        return res.json({ message: 'Something went wrong' })
    }
})

userRouter.route('/login')
.post((req, res)=>{
    passport.authenticate('local')(req, res, ()=>{
        const token = authenticate.getToken({ _id: req.user._id })
        res.statusCode = 200
        res.json({ token: token, success: true })
    })
})

userRouter.route('/check').get(authenticate.verifyUser, (req, res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json({ success: true })
})

module.exports = userRouter