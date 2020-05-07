const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const fs = require('fs')
const locationModal = require("./models/Location");

const app = express();
app.use(morgan("dev"));
app.use('/images' ,express.static('images'))
app.use(express.json({
  limit: '50mb'
}));
app.use(cors());


app.post('/uploads', async (req, res)=>{
  const blob = req.body.blob
  const name = req.body.name
  var base64Data = blob.replace(/^data:image\/png;base64,/, "");

fs.writeFile(`./images/${name}.png`, base64Data, 'base64', function(err) {
  console.log(err);
});
res.json({
  status: 'success',
  message: `${name}.png`
})
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
