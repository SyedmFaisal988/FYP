const express = require('express');
const passport = require('passport');
const authenticate = require('../authenticate')
const User = require('../models/User')
const locationModal = require('../models/Location');
const { json } = require('express');

const userRouter = express.Router();
userRouter.use(express.json())


userRouter.route('/signup').post(async (req, res)=>{
    console.log('hit')
    const { body: { username, password, email, address } } = req
    try {
        const user = await User.findOne({ email });
        if(user){
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            return res.json({ message: `${email} is already in use`, success: false })
        }else{
            const newUser = await User.register(new User({
                username,
                address,
                email,
            }), password)
            await locationModal.create({ userId: newUser._id.toString(), cords: [] })
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({ message: 'signup successful', success: true })
        }
    }
    catch(err){
        console.log(err)
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        return res.json({ message: 'Something went wrong', success: false })
    }
})

userRouter.route('/get').post(authenticate.verifyUser, authenticate.verifyEmployee, (req, res) => {
    const {body: {userId}} = req
    User.findById(userId).then(user => {
        console.log('user', user)
        res.json({
            status: 200,
            message: user,
        })
    }).catch(err => {
        console.log(err, 'a')
        res.json({
            status: 500,
            message: 'Internal server error'
        })
    })
})

userRouter.route('/login')
.post((req, res)=>{
    console.log('aya')
    passport.authenticate('local')(req, res, ()=>{
        const token = authenticate.getToken({ _id: req.user._id })
        res.statusCode = 200
        return res.json({ token: token, success: true, isAdmin: req.user.isadmin })
    })
  
})

userRouter.route('/login-admin').post((req, res)=>{
    passport.authenticate('local')(req, res, ()=>{
        const { user: { isadmin, _id } } = req
        if(isadmin){
            const token = authenticate.getToken({ _id })
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            return res.json({ token: token, success: true })
        }else{
            res.statusCode = 401
            res.setHeader('Content-Type', 'application/json')
            return res.json({ token: null, success: false })
        }
    })
})

userRouter.route('/check').get(authenticate.verifyUser, (req, res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json({ success: true })
})

module.exports = userRouter