/**
 * @function
 * The `isAuth` function checks if the browser (and user) has an existing session or not.
 * This allows frontend to either directly forward a user to home page or to log-in page.
 *
 * @param req.session.user {Object} The part of response object with the cookie information
 * of the user.
 * @param res {Object} The response object with a status and JSON object with a message field.
 * If there is already a session , the status is 200 and the session information is sent as JSON object.
 * If there is no session, status is 401 alongside an appropriate "Unauthorized" message.
 */
exports.isAuth = (req, res) => {
  if (req.session.user) {
    return res.status(200).json(req.session.user);
  } else {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};
