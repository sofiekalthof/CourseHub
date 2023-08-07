// Route to check auth and return user info in cookie
exports.isAuth = (req, res) => {
  console.log(
    "isAuth Called, userSession(req.session.user) in session-store: ",
    req.session.user
  );
  console.log("isAuth Called, req.session in session-store: ", req.session);
  if (req.session.user) {
    return res.status(200).json(req.session.user);
  } else {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};
