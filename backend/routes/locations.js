const express = require('express');
const authenticate = require('../authenticate')
const locationModal = require('../models/Location')
const fs = require("fs");

const locationRouter = express.Router()
locationRouter.use(express.json({
    limit: "50mb",
  }))

locationRouter.route("/uploads")
.post(authenticate.verifyUser ,async (req, res) => {
    const blob = req.body.blob;
    const name = req.body.name;
    var base64Data = blob.replace(/^data:image\/png;base64,/, "");
    console.log('uplo')
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
  
  locationRouter.route("/getLocationData",).get(authenticate.verifyUser, (req, res) => {
    const { user: { isadmin: isAdmin } } = req
    try {
      locationModal.findOne(isAdmin ? {} : { userId: req.user._id }).then((resp) => {
        res.statusCode = 200;
        return res.json({
          status: true,
          message: resp || {
            cords: []
          },
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
  
  locationRouter.route("/setLocationData").post(authenticate.verifyUser, (req, res) => {
    const { body: { point } } = req
    locationModal.findOneAndUpdate({ userId: req.user._id }, { $push: { 'cords': { ...point, created: new Date() } } })
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


  locationRouter.route("/updateStatus").post(authenticate.verifyUser, async (req, res) => {
    const { body: { point: { id, point }, status } } = req
    console.log({ status, point, id, })
    const locationData = await locationModal.findById(id).lean();
    const updatePointIndex = locationData.cords.findIndex(ele => ele.id === point.id)
    if ( updatePointIndex >= 0 ) {
      if (status === 'processing')
        point.processing = new Date();
      else 
        point.complete = new Date();
      const updatedCords = locationData.cords;
      updatedCords[updatePointIndex] = point;
      const resp = await locationModal.findByIdAndUpdate(id, { $set: { cords: updatedCords } })
      console.log({ resp });
      return res.json({
        status: 200,
        message: 'operation successfull'
      })
    }
  });


  module.exports = locationRouter