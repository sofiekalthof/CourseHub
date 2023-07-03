const mongoose = require("mongoose");
require("dotenv").config();

// Initialize parameters
const dbName = process.env.DB_NAME;

// database connection string
const dbUrl = process.env.MONGODB_URL;

// gridFSBucket variable
let gridFSBucket;

// create database connection
mongoose
  .connect(dbUrl, {
    dbName: dbName,
  })
  .then(() => {
    // console.log(mongoose.connection.db);
    gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "files",
    });
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
  });

module.exports = {
  mongoose: mongoose,
  gridFSBucket: gridFSBucket,
};
