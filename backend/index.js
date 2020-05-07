const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const fs = require("fs");
const locationModal = require("./models/Location");

const app = express();
app.use(morgan("dev"));
app.use("/images", express.static("images"));
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(cors());

app.post("/uploads", async (req, res) => {
  const blob = req.body.blob;
  const name = req.body.name;
  var base64Data = blob.replace(/^data:image\/png;base64,/, "");

  fs.writeFile(`./images/${name}.jpg`, base64Data, "base64", function (err) {
    if (err) {
      res.statusCode = 500;
      return res.json({
        status: false,
        message: "error",
      });
    }
  });
  res.statusCode = 200;
  res.json({
    status: true,
    message: `${name}.jpg`,
  });
});

app.use("/getLocationData", (req, res) => {
  try {
    locationModal.findById('5eb3dbe988e34d69fc751470').then((resp) => {
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
  const { body: { point } } = req
  console.log({ point })
  locationModal.findByIdAndUpdate('5eb3dbe988e34d69fc751470', { $push: { 'cords': point } })
    .then((resp) => {
      console.log({ success: "success" });
      res.json({
        status: 200,
        message: "added successfully",
      });
    })
    .catch((err) => {
      console.log({ err });
      return res.json({
        status: 500,
        message: "Something went wrong",
      });
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
