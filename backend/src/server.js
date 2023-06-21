const express = require("express");
const cors = require("cors")
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
app.route("/courses/:name").get(async (req, res) => {
    let courses = [];
    try{
      // full text search
      courses = await CourseModel.find({ $text: {$search: req.params.name}});
      res.status(200).json(courses);
    } catch(err) {
      res.status(500).send("Server error. Request could not be fulfilled.");
    }
});

// Get a specific user
app.route("/:email").get(async (req, res) => {
    const email = req.params.email;

    try{
      const result = await UserModel.findOne({ email: email });

      if (!result) {
        res.status(400).json({ error: "Searched user not found" });
        return;
      }
      res.status(200).json(result);
    } catch(err) {
      res.status(500).send("Server error. Request could not be fulfilled.");
    }
});

// Create a new user
app.route("/").post(async (req, res) => {
    // TODO: check if email already exists in db(utils) and return an appropriate message back
    const doc = new UserModel(req.body);

    try {
      // check if there is a user with the same email
      const result = await UserModel.findOne({ email: doc.email });


      if (result) {
        res.status(400).json({ error: "A user with that email already exists" });
        return;
      }
      
      await doc.save();

      res.status(200).json({ message: "New User created" });
    } catch(err) {
      res.status(500).send("Server error. Request could not be fulfilled.");
    }
  });
