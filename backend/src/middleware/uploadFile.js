const fs = require("fs");
const multer = require("multer"); // for parsing FormData which is type multipart-bodies

// storage configuration for multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var path = "./public";
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    // extract type of data
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];

    var filename = file.fieldname + "_" + Date.now() + "." + extension;
    // use id of assignment and extension type to save the file
    cb(null, filename);
  },
});

exports.upload = multer({
  storage: storage,
});
