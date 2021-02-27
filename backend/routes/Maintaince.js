const express = require("express");
const userModal = require("../models/User");
const authenticate = require("../authenticate");
const MantainceModal = require("../models/Maintaince");

const maintainceRouter = express.Router();
maintainceRouter.use(express.json());

maintainceRouter
  .route("/setMaintaince")
  .post(authenticate.verifyUser, (req, res) => {
    console.log("aya", req.body);
    const {
      body: { houseNo, type1, type2, type3, type4 },
    } = req;

    userModal
      .findOne({ address: houseNo })
      .then((user) => {
        if (!user) {
          return res.json({
            status: 400,
            message: "Invalid address entered",
          });
        }
        return MantainceModal.create({
          address: houseNo,
          EmployeeId: req.user.id,
          type1,
          type2,
          type3,
          type4,
        }).then((resp) => {
          res.json({
            status: 200,
            message: resp,
          });
        });
      })
      .catch(() => {
        res.json({
          status: 500,
          message: "Internal server error",
        });
      });
  });

module.exports = maintainceRouter;
