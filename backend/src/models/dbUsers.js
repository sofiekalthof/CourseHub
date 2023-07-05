const mongoose = require("../dbConnection.js");

// Initialize parameters
const collectionName = process.env.DB_COLLECTION_USERS;

// create mongoose schema
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
  password: {
    type: String,
    required: true,
  },
  // TODO: other user-analytics?
});

// create model from schema
let UserModel = mongoose.model(collectionName, (schema = UserSchema));

// export model
module.exports = UserModel;
