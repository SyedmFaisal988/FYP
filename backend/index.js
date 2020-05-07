const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const multer = require('multer')
const fs = require('fs')
const locationModal = require("./models/Location");
var FileReader = require('filereader')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('aya')
      cb(null, './images/'  )
    }, filename: (req, file, cb)=> {
      cb(null, file.originalname)
    }
  })
  
  const fileFilter = (req, file, cb)=> {
    if(file.mimetype === 'image/jpg' )
      return cb(null, true)
    return cb(null, false)
  }

  const upload = multer({
    storage,
    // fileFilter
  })

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());


app.post('/uploads', async (req, res)=>{
    const blob = req.body.blob
    var reader= new FileReader();
    reader.readAsBinaryString(blob); 
    reader.onloadend = function() {
        var base64data = reader.result;                
        console.log(base64data);
    }
  })

app.use("/getLocationData", (req, res) => {
  try {
    locationModal.find({}).then((resp) => {
      res.statusCode = 200;
      return res.json({
        status: true,
        message: resp,
      });
    });
  } catch (err) {
    console.log({ err });
    res.statusCode = 500;
    res.json({
      status: false,
      message: "Something went wrong",
    });
  }
});

app.post("/setLocationData", (req, res) => {
  locationModal.create({
    cords: [
      {
        latitude: 0.456,
        longitude: 188.54,
      },
    ],
  });
});



const server = http.createServer(app);
server.listen(4000, "localhost", () => {
  console.log("server running on 4000");
  const url = `mongodb://localhost:27017/location`;
  const connect = mongoose.connect(url).then((db) => {
    console.log("connected");
  });
});
