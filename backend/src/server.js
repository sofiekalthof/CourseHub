const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
require('dotenv').config();
const UserModel = require("./models/dbUsers.js");
const CourseModel = require("./models/dbCourses.js");
const TaskModel = require("./models/dbTasks.js");
const CourseUserModel = require("./models/dbCourseUser.js");

// Define port
const port = 3600;

// Create Express app
const app = express();

// Add CORS to all routes and methods
app.use(cors());

// Enable parsing of JSON bodies
app.use(express.json());

// start listening to the port
app.listen(port, () => {
    console.log("Listening on " + port + ".");
  }); 

// Get all courses
app.route("/courses").get(async (req, res) => {
    let courses = [];
    try{
      courses = await CourseModel.find({});
      res.status(200).json(courses);
    } catch(err) {
      res.status(500).send("Server error. Request could not be fulfilled.");
    }
});

// Get a specific user
app.route("/login").post(async (req, res) => {

    try{
      // check if user exists
      const user = await UserModel.findOne({ email: req.body.email });

      if (!user) {
        res.status(400).json({ msg: "User not found" });
        return;
      }

      // check if passwords match
      const matchPassword = await bcrypt.compare(req.body.password, user.password);
      if (matchPassword) {
        return res.status(200).json({ msg: 'You have logged in successfully' });
      } else {
        return res.status(400).json({ msg: 'Invalid credential' });
      }
    } catch(err) {
      res.status(500).send("Server error. Request could not be fulfilled.");
    }
});

// Create a new user
app.route("/register").post(async (req, res) => {

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
          return res.status(400).json({ msg: 'Error while saving the password' });
        }
        // change the password to hash
        newUser.password = hash

        // save user to database
        const addedUser = await newUser.save();
        
        if (addedUser) {
          res.status(200).json({ msg: "New user created" });
        }
      });
    } catch(err) {
      res.status(500).send("Server error. Request could not be fulfilled.");
    }
  });
