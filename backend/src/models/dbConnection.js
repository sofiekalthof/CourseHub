const mongoose = require("mongoose");
require("dotenv").config();

// initialize parameters
const dbName = process.env.DB_NAME;
const dbUrl = process.env.MONGODB_URL;

// create database connection
mongoose
  .connect(dbUrl, {
    dbName: dbName,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
  });

module.exports = mongoose;
