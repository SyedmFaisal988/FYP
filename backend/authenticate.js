const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken') 
const LocalStrategy = require('passport-local').Strategy

const config = require('./config')
const User = require('./models/User')

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user)=>{
    return jwt.sign(user, config.secretKey)        
};

const options = {
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
secretOrKey: config.secretKey
};

exports.jwtPassport = passport.use(new JwtStrategy(options, (jwt_payload, done)=>{
 User.findOne({_id: jwt_payload._id}, (err, user)=>{
     if(err){
         return done(err, false);
     }else if(user) {
        return done(null, user)
     }else{
         return done(null, false)
     }
 })
}))

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    const { user: { isadmin } } = req
    if(!isadmin){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json')
        res.json({ success: false, message: 'Invalid credentials' })
    }else{
        next()
    }
}

exports.verifyEmployee = (req, res, next) => {
    const { user: { type } } = req
    console.log(type, 'type')
    if(type !== 'EMPLOYEE'){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json')
        res.json({ success: false, message: 'Invalid credentials' })
    }else{
        next()
    }
}