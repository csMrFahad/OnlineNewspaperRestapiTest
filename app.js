require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./api/routes/user");
const articleRoutes = require("./api/routes/article");

mongoose.connect(
  "mongodb+srv://" +
    process.env.MONGO_ADMIN_NAME +
    ":" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.dhpqr.mongodb.net/Cluster0?retryWrites=true&w=majority"
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/user", userRoutes);
app.use("/article", articleRoutes);


app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
