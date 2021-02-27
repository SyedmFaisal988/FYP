const express = require("express");
const userModal = require("../models/User");
const authenticate = require("../authenticate");
const VehicleModal = require("../models/Vehicle");
const ExpenseModal = require("../models/Expenses");
const MantainceModal = require("../models/Maintaince");

const maintainceRouter = express.Router();
maintainceRouter.use(express.json());

maintainceRouter
  .route("/setMaintaince")
  .post(authenticate.verifyUser, authenticate.verifyEmployee, (req, res) => {
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

maintainceRouter
  .route("/addExpense")
  .post(authenticate.verifyUser, authenticate.verifyEmployee, (req, res) => {
    const {
      body: { type, cost, vehicleNo, description } = {},
    } = req;

    VehicleModal.findOne({ restrationNo: vehicleNo })
      .then(async (vehicle) => {
        if (!vehicle) {
          return res.json({
            status: 400,
            message: "Vehicle not found",
          });
        }

        const expense = ExpenseModal.create({
          type,
          cost,
          description,
          EmployeeId: req.user.id,
          vehicle_id: vehicle._id,
        });
        return res.json({
          status: 200,
          message: expense,
        });
      })
      .catch(() => {
        res.json({
          status: 500,
          message: "Something went wrong",
        });
      });
  });

module.exports = maintainceRouter;
