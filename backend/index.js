const mongoose = require('mongoose')

const url = `mongodb://localhost:27017/Location`

const connect = mongoose.connect(url).then(db=>{
    console.log('connected')
})