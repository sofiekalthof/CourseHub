const UserModel = require("../models/dbUsers");
const bcrypt = require("bcrypt");

// This function allows user to log in and returns a cookie with user information, if log-in is successful
// Request body should have an email and password fields
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

// Create a new user
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
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
};

// Logout from website by destorying the session
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
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
};
