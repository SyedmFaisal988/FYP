const express = require("express");
const crowdModal = require("../models/Crowd");
const authenticate = require("../authenticate");
const locationModal = require("../models/Location");
const UserModal = require('../models/User');
const MaintainceModal = require('../models/Maintaince');
const { Expo } = require('expo-server-sdk');
let expo = new Expo();

const fs = require("fs");

const locationRouter = express.Router();
locationRouter.use(
  express.json({
    limit: "200mb",
  })
);

const handleSendNotification = () => {
  const to = [];
  UserModal.find({ type: 'EMPLOYEE' }).lean().then((res) => {
    res.forEach(user => {
      user.pushToken && to.push(user.pushToken);
    })
    let messages = [];
  messages.push({
    to,
    sound: "default",
    body: "New pickup avaliable",
    data: { withSome: "data" },
    priority: 'high'
  });
  let chunks = expo.chunkPushNotifications(messages);
  const promises = chunks.map(chunk => expo.sendPushNotificationsAsync(chunk));
  Promise.all(promises).then((resp) => console.log(resp)).catch((err) => console.log('err', err))
  }).catch(() => {

  })
}

locationRouter.route('/testNotification').get((req, res) => {
  handleSendNotification();
  res.json()
})

locationRouter
  .route("/uploads")
  .post(authenticate.verifyUser, async (req, res) => {
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

  locationRouter.route('/getDashboardData').get(authenticate.verifyUser, async (req, res) => {
    locationModal.find({}).then((resp) => {
      const filterData = resp ? resp.filter(ele => ele.cords.length) : [];
      const formatedData = [];
      filterData.forEach((ele) => {
        ele.cords.forEach((elem) => {
          if (elem.employeeId) {
          formatedData.push({
            userId: ele.userId,
            ...elem._doc,
          })
        }
        })
      })
      const promises = formatedData.map(async (record) => {
        const data = await UserModal.findById(record.userId);
        const employeeData = await UserModal.findById(record.employeeId)
        const maintainceData = await MaintainceModal.findById(record._id)
        console.log(maintainceData)
        return [data, employeeData, maintainceData];
      })
      Promise.all(promises).then((response) => {
        res.statusCode = 200;
        res.json({
          status: true,
          message: formatedData.map((ele, index) => ({
            ...ele,
            user: response[index][0],
            employee: response[index][1],
            maintainceDetails: response[index][2]
          }))
        })
      })
    })
    .catch(err => {
      res.statusCode = 500;
      res.json({
        status: false,
        message: err
      })
    })
  })

locationRouter
  .route("/getLocationData")
  .get(authenticate.verifyUser, (req, res) => {
    const {
      user: { isadmin: isAdmin },
    } = req;
    try {
      locationModal
        .find(isAdmin ? {} : { userId: req.user._id })
        .then((resp) => {
          const filterData = resp.filter(ele => ele.cords.length)
          res.statusCode = 200;
          return res.json({
            status: true,
            message: filterData || {
              cords: [],
            },
          });
        });
    } catch (err) {
      res.statusCode = 500;
      res.json({
        status: false,
        message: "Something went wrong",
      });
    }
  });

locationRouter
  .route("/setLocationData")
  .post(authenticate.verifyUser, (req, res) => {
    const {
      body: { point },
    } = req;
    locationModal
      .findOneAndUpdate(
        { userId: req.user._id },
        { $push: { cords: { ...point, created: new Date() } } }
      )
      .then((resp) => {
        res.json({
          status: 200,
          message: "added successfully",
        });
      })
      .catch((err) => {
        return res.json({
          status: 500,
          message: "Something went wrong",
        });
      });
  });

  locationRouter.route('/getCrowdData').get(authenticate.verifyUser, async (req, res) => {
    crowdModal.find({}).then((resp) => {
      const data = [];
      resp.forEach(ele => {
        const { description, image, quality, selectedItems, id } = ele;
        data.push({ description, image, quality, selectedItems, id });
      })
      res.statusCode = 200;
      res.json(data)
    })
    .catch(err => {
      res.statusCode = 500;
      res.json({
        status: 500,
        message: "Something went wrong",
      });
      console.log('err', err)
    })
  })

locationRouter.route('/setCrowdData').post(authenticate.verifyUser, async (req, res) => {
  const {
    body: {
      cover,
      quality,
      latitude,
      longitude,
      description,
      selectedItems,
    },
  } = req;
  const base64Data = cover.replace(/^data:image\/png;base64,/, "");
  const coverName = `${new Date().valueOf()}.jpg`;
  await fs.writeFileSync(`./images/${coverName}`, base64Data, "base64");
  await crowdModal.create({
    image: coverName,
    quality,
    latitude,
    longitude,
    description,
    selectedItems,
    created: new Date(),
    userId: req.user._id,
  });
})

locationRouter
  .route("/setComplaint")
  .post(authenticate.verifyUser, async (req, res) => {
    const {
      body: {
        subject,
        description,
        cover,
        selectedItems,
        attachments,
        latitude,
        longitude,
      },
    } = req;
    const promises = [];
    const base64Data = cover.replace(/^data:image\/png;base64,/, "");
    const coverName = `${new Date().valueOf()}.jpg`;
    const attachmentsName = [];
    promises.push(
      fs.writeFileSync(`./images/${coverName}`, base64Data, "base64")
    );
    attachments.forEach((ele) => {
      const mimeType =
        ele.type === "image" ? "jpg" : ele.type === "video" ? "mp4" : "m4a";
      const base64Data = ele.blob
        .replace(/^data:image\/png;base64,/, "")
        .replace("data:audio/mpeg;base64,", "")
        .replace("data:image/jpeg;base64,", "")
        .replace("data:video/mp4;base64,", "");
      const name = `${new Date().valueOf()}.${mimeType}`;
      attachmentsName.push(name);
      promises.push(fs.writeFileSync(`./images/${name}`, base64Data, "base64"));
    });
    Promise.all(promises)
      .then(() => {
        return locationModal.findOneAndUpdate(
          { userId: req.user._id },
          {
            $push: {
              cords: {
                subject,
                description,
                selectedItems: selectedItems.join(';'),
                latitude,
                image: coverName,
                attachments: attachmentsName,
                longitude,
                created: new Date(),
              },
            },
          }
        );
      })
      .then((resp) => {
        handleSendNotification();
        res.json({
          status: 200,
          message: "added successfully",
        });
      })
      .catch((err) => {
        return res.json({
          status: 500,
          message: "Something went wrong",
        });
      });
  });

locationRouter
  .route("/updateStatus")
  .post(authenticate.verifyUser, async (req, res) => {
    const {
      body: {
        point: { id, point },
        status,
      },
    } = req;
    const locationData = await locationModal.findById(id).lean();
    const updatePointIndex = locationData.cords.findIndex(
      (ele) => ele.id === point.id
    );
    if (updatePointIndex >= 0) {
      if (status === "processing") point.processing = new Date();
      else point.complete = new Date();
      const updatedCords = locationData.cords;
      updatedCords[updatePointIndex] = point;
      const resp = await locationModal.findByIdAndUpdate(id, {
        $set: { cords: updatedCords },
      });
      return res.json({
        status: 200,
        message: "operation successfull",
      });
    }
  });

module.exports = locationRouter;
