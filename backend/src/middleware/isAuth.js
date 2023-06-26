// middleware to check if user has a session
const isAuth = function (req, res) {
  console.log(
    "isAuth Called, userSession in session-store: ",
    req.session.user
  );
  if (req.session.user) {
    return res.status(200).json(req.session.user);
  } else {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};

module.exports = isAuth;
