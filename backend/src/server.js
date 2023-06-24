require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
const session = require('express-session')
const MongoDBstore = require('connect-mongodb-session')(session);
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

// allow connect-mongodb-session library to save sessions under mySessions collection
const mongoDBstore = new MongoDBstore({
  uri: process.env.DATABASE_CONNECTION_STRING,
  collection: 'mySessions',
});

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    name: 'session-id', // name of the cookies (key field)
    store: mongoDBstore,
    cookie: {
      maxAge: process.env.SESSION_MAX_LENGTH, 
      sameSite: false,  // same-site and cross-site(diff. schemes, domain or sub-domain) requests
      secure: process.env.PROD || false, // need an HTTPS enabled browser
    },
    resave: true,  // force session to be saved in session store, even if session was not modified
    saveUninitialized: false,  // dont save session if it was not modified (i.e. no login yet)
  })
);

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
        // create a new session for the user (email and id used to identify user)
        const userSession = { _id: user._id, email: user.email };

        // attach new session to express-session
        req.session.user = userSession;

        // status, message and new session (as a cookie) sent to frontend
        return res.status(200).json({ msg: 'You have logged in successfully', userSession });
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
