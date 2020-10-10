const express = require("express");
const authenticate = require("../authenticate");
const sensorModal = require("../models/Sensors");

const sensorRouter = express.Router();
sensorRouter.use(
  express.json({
    limit: "50mb",
  })
);

sensorRouter.route("/saveData").post(authenticate.verifyUser, (req, res) => {
  const Gyroscope = [];
  const Magnetometer = [];
  const Accelerometer = [];
  req.body.forEach((ele) => {
    Gyroscope.push({ ...ele[0], time: ele[3] });
    Magnetometer.push({ ...ele[1], time: ele[3] });
    Accelerometer.push({ ...ele[2], time: ele[3] });
  });
  console.log(Gyroscope, Magnetometer, Accelerometer);
  sensorModal.findOne({ userId: req.user.id }).then((node) => {
    if (node) {
      sensorModal
        .findByIdAndUpdate(node._id, {
          $push: { Gyroscope, Magnetometer, Accelerometer },
        })
        .then((resp) => {
          console.log("save", resp);
        });
    } else {
      sensorModal
        .create({
          Gyroscope,
          Magnetometer,
          Accelerometer,
          userId: req.user.id
        })
        .then((resp) => {
          console.log("created", resp);
        });
    }
  });
  return res.json({
    status: 200,
    message: "save",
  });
});

module.exports = sensorRouter;
