const fs = require("fs");
const multer = require("multer"); // for parsing FormData which is type multipart-bodies and saving files

// storage configuration for multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // save files in public folder
    var path = "./public";
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    // extract type of file
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];

    // use id of assignment and extension type to save the file
    // the current date is used to ensure each file name is unique
    var filename = file.fieldname + "_" + Date.now() + "." + extension;
    cb(null, filename);
  },
});

// initialize multer and export it
exports.upload = multer({
  storage: storage,
});
