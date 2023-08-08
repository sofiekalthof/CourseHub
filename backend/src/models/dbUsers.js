const mongoose = require("./dbConnection.js");

// initialize parameters
const collectionName = process.env.DB_COLLECTION_USERS;

/* The schema `UserSchema` is used to store information for each user. */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  // password (saved as encrypted string)
  password: {
    type: String,
    required: true,
  },
});

// create model from schema
let UserModel = mongoose.model(collectionName, (schema = UserSchema));

// export model
module.exports = UserModel;
