// middleware to check if user has a session
/**
 * @function
 * The `checkAuth` function is the middleware to check if the browser (and user)
 * has an existing session or not.
 *
 * @param req.session.user {Object} The part of response object with the cookie information
 * of the user.
 * @param res {Object} The response object with a status and JSON object with a message field.
 * If there is already a session, the next API controller function is executed.
 * If there is no session, status is 401 alongside an appropriate "Unauthorized" message.
 */
exports.checkAuth = (req, res, next) => {
  if (req.session.user) {
    // if there is a session, go to next API call
    next();
  } else {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};
