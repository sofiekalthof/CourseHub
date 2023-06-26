// middleware to check if user has a session
const checkAuth = function (req, res, next) {
  if (req.session.user) {
    console.log("session exists");
    next();
  } else {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};

module.exports = checkAuth;
