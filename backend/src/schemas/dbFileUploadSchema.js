const mongoose = require("../dbConnection.js");

// create mongoose schema
const FileUploadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  file: {
    data: Buffer,
    contentType: String
  }
});

// export schema only, since it is needed for defining the TaskSchema
module.exports = FileUploadSchema;