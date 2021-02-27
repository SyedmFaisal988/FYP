const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const createError = require('http-errors');

const userRouter = require('./routes/user');
const sensorRouter = require('./routes/Sensor');
const locationRouter = require('./routes/locations');
const maintainceRouter = require('./routes/Maintaince');
const { port, hostName, db_name, db_url } = require('./config');

const app = express();
app.use(morgan("dev"));
app.use("/images", express.static("images"));

app.use(cors());
app.use('/users', userRouter);
app.use('/sensor', sensorRouter);
app.use('/location', locationRouter);
app.use('/maintaince', maintainceRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

const server = http.createServer(app);
server.listen(port, hostName, () => {
  console.log(`server running on ${port}`);
  const url = `${db_url}/${db_name}`;
  mongoose.connect(url).then((db) => {
    console.log("connected");
  });
});
