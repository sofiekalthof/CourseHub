const path = require("path");

exports.downloadFile = async (req, res) => {
  const filePath = path.join(__dirname, "../..", "public", req.params.filename);
  console.log("filepath: ", filePath);
  res.download(
    filePath,
    req.params.originalfilename, // alternate name for the file when user downloads it
    (err) => {
      if (err) {
        res.status(500).send("Problem downloading the file");
      }
    }
  );
};
