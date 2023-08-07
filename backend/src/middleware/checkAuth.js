// middleware to check if user has a session
exports.checkAuth = (req, res, next) => {
  // console.log(
  //   "checkAuth Called, userSession in session-store: ",
  //   req.session.user
  // );
  if (req.session.user) {
    // if there is a session, go to next API call
    next();
  } else {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};
