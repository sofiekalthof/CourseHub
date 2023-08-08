const path = require("path");

/**
 * @function
 * The `downloadFile` function downloads a file from public folder.
 * @typedef {object} downloadFileParams
 * @property {string} filename this is name of the file in public folder.
 * @property {string} originalfilename this is original name of the folder.
 *
 * @param {import('express').Request<downloadFileParams, {}, {}, {}} req
 *
 * @param req.params.filename {Object} JSON payload field with name of the file.
 * @param req.params.originalfilename {Object} JSON payload field with original name of the file.
 * @param res {Object} The response object with a status and JSON object with a message field.
 * If there is any problem saving the file , the status is 500 and alongside an appropriate message.
 */
exports.downloadFile = async (req, res) => {
  // prepare file path
  const filePath = path.join(__dirname, "../..", "public", req.params.filename);

  // download file
  res.download(
    filePath,
    req.params.originalfilename, // alternate name for the file when user downloads it
    (err) => {
      if (err) {
        res.status(500).send({ msg: "Problem downloading the file" });
      }
    }
  );
};
