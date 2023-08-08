const UserModel = require("../models/dbUsers");
const bcrypt = require("bcrypt");

/**
 * @function
 * The `login` function is an API controller responsible for handling the login functionality. It
 * checks if a user with the given credentials exist. If so, a session is created in backend and
 * a cookie is sent to frontend. If not, appropriate status and error message is sent back.
 * @typedef {object} loginBody
 * @property {string} email this is email of the user.
 * @property {string} password this is password of the user.
 *
 * @param {import('express').Request<{}, {}, loginBody, {}} req
 *
 * @param req.body.email {Object} JSON payload field with email of the user.
 * @param req.body.password {Object} JSON payload field with password of the user.
 * @param res {Object} The response object with a status and JSON object with a message field. If function
 * was successful, the status is 200 alongside an appropriate message. If there is no user or the passwords
 * do not match, status is 400 alongside an appropriate message. If any operation fails to execute,
 * the status is set to 500, and the default error message "Server error. Request
 * could not be fulfilled." is set.
 */
exports.login = async (req, res) => {
  try {
    // check if user exists
    const user = await UserModel.findOne({ email: req.body.email });

    // if user is not known, return error message
    if (!user) {
      res.status(400).json({ msg: "User not found" });
      return;
    }

    // check if passwords match
    const matchPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (matchPassword) {
      // create a new session for the user (email and id used to identify user)
      const userSession = { id: user._id };

      // attach new session to express-session
      req.session.user = userSession;

      // status, message and new session (as a cookie) sent to frontend
      return res.status(200).json({
        msg: "login done",
        userInfo: req.session.user,
      });
    } else {
      return res.status(400).json({ msg: "Invalid credential" });
    }
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
};

/**
 * @function
 * The `register` function is an API controller responsible for for creating a new user in the database.
 * @typedef {object} registerBody
 * @property {string} username this is username of the user.
 * @property {string} email this is email of the user.
 * @property {string} password this is password of the user.
 *
 * @param {import('express').Request<{}, {}, registerBody, {}} req
 *
 * @param req.body.username {Object} JSON payload field with username of the user.
 * @param req.body.email {Object} JSON payload field with email of the user.
 * @param req.body.password {Object} JSON payload field with password of the user.
 * @param res {Object} The response object with a status and JSON object with a message field. If function
 * was successful, the status is 200 alongside an appropriate message. If the user already exists or
 * there is an issue in password encryption, status is 400 alongside an appropriate message. If any
 * operation fails to execute, the status is set to 500, and the default error message "Server error.
 * Request could not be fulfilled." is set.
 */
exports.register = async (req, res) => {
  try {
    // check if there is a user with the same email
    const user = await UserModel.findOne({ email: req.body.email });

    if (user) {
      res.status(400).json({ msg: "A user with that email already exists" });
      return;
    }

    // create new user
    const newUser = new UserModel(req.body);

    // hash the password
    bcrypt.hash(req.body.password, 7, async (err, hash) => {
      if (err) {
        return res.status(400).json({ msg: "Error while saving the password" });
      }
      // change the password to hash
      newUser.password = hash;

      // save user to database
      const addedUser = await newUser.save();

      if (addedUser) {
        res.status(200).json({ msg: "New user created" });
      }
    });
  } catch (err) {
    res
      .status(500)
      .send({ msg: "Server error. Request could not be fulfilled." });
  }
};

/**
 * @function
 * The `logout` function is an API controller responsible for logging out a user from the website by
 * destroying the session and cookie information from storage and request object.
 *
 * @param res {Object} The response object with a status and JSON object with a message field. If function
 * was successful, the status is 200 alongside an appropriate message. If any operation fails to execute,
 * the status is set to 500, and the default error message "Server error. Request
 * could not be fulfilled." is set.
 */
exports.logout = async (req, res) => {
  try {
    // delete user's specific session
    delete req.session.user;

    // destroy session all together
    req.session.destroy();

    // delete session from db
    req.session = null;

    res.status(200).json({ msg: "Logged out." });
  } catch (err) {
    res
      .status(500)
      .send({ msg: "Server error. Request could not be fulfilled." });
  }
};
