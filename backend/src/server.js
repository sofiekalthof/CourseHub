require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoDBstore = require("connect-mongodb-session")(session);
const UserModel = require("./models/dbUsers.js");
const CourseModel = require("./models/dbCourses.js");
const TaskModel = require("./models/dbTasks.js");
const CourseUserModel = require("./models/dbCourseUser.js");
const checkAuth = require("./middleware/checkAuth.js");
const isAuth = require("./middleware/isAuth.js");
const TimelineModel = require("./models/dbTimeline.js");
const MilestoneModel = require("./models/dbMilestones.js");
const TimelineUserModel = require("./models/dbTimelineUser.js");

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
  uri: process.env.MONGODB_URL,
  databaseName: process.env.DB_NAME,
  collection: "userSessions",
});

// Add express-session to all routes
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    name: "session-id", // name of the cookies (key field)
    store: mongoDBstore,
    cookie: {
      maxAge: parseInt(process.env.SESSION_MAX_LENGTH),
      sameSite: false, // same-site and cross-site(diff. schemes, domain or sub-domain) requests
      secure: process.env.PROD || false, // need an HTTPS enabled browser
    },
    resave: true, // force session to be saved in session store, even if it was not modified during a request
    saveUninitialized: false, // dont save session if it was not modified (i.e. no login yet)
    unset: "destroy", // delete cookie from db when it is null(completes task in a few minutes)
  })
);

// start listening to the port
app.listen(port, () => {
  console.log("Listening on " + port + ".");
});

// Update milestone(autom.)

// Take task

// Create task
app.route("/courses/:id/createtask").post(checkAuth, async (req, res) => {
  // IMPROVEMENT: Currently works with sending only the course id, but would be better if we send timeline id directly
  // MAKE-SURE: req.body has type, desc and data
  // EXAMPLE: {
  //     "type": "Quiz",
  //     "description": "test",
  //     "data": "2023-07-15",
  //     "questions": ["What is the capital of Germany?", "What does the fox say?"],
  //     "answers": [["Berlin", "Berlin", "Berlin", "Berlin"], ["No idea", "No idea", "No idea", "No idea"]],
  //     "correctAnswers": [[0,3], [1]],
  //     "timeline": "64993b0b326b752cc8f3e421"
  // }
  let newTask;
  try {
    // create new task
    newTask = new TaskModel(req.body);

    // save task in db
    await newTask.save();

    console.log(req.params.id);
    // find the course the task belongs to
    const course = await CourseModel.find({ _id: req.params.id });

    // extract timeline of the course
    const courseTimelineId = course[0].timeline;

    // find timeline and add task to it
    const result = await TimelineModel.findByIdAndUpdate(courseTimelineId, {
      $push: {
        tasks: newTask,
      },
    });

    if (!result) {
      res
        .status(400)
        .json({ msg: "Timeline not updated (task was not added)" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
});

// Create milestone
app.route("/courses/:id/createmilestone").post(checkAuth, async (req, res) => {
  // IMPROVEMENT: Currently works with sending only the course id, but would be better if we send timeline id directly
  // MAKE-SURE: req.body has type, desc and data
  // EXAMPLE: {
  //     "type": "Lecture",
  //     "description": "test",
  //     "data": "2023-07-15",
  //     "timeline": "64993b0b326b752cc8f3e421"
  // }
  let newMilestone;
  try {
    // create new task
    newMilestone = new MilestoneModel(req.body);

    // save task in db
    await newMilestone.save();

    console.log(req.params.id);
    // find the course the milestone belongs to
    const course = await CourseModel.find({ _id: req.params.id });

    // extract timeline of the course
    const courseTimelineId = course[0].timeline;

    // find timeline and add milestone to it
    const result = await TimelineModel.findByIdAndUpdate(courseTimelineId, {
      $push: {
        milestones: newMilestone,
      },
    });

    if (!result) {
      res
        .status(400)
        .json({ msg: "Timeline not updated (milestone was not added)" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
});

// // Take course
// app.route("/courses/:id/takecourse").post(checkAuth, async (req, res) => {
//   // IMPROVEMENT: user data could be received from req.session.user directly (to check)
//   // IMPROVEMENT: would be better if we send timeline id directly
//   let currTaskStats = [];
//   let currMilestioneStats = [];
//   try {
//     // find the course user is trying to subscribe to
//     const course = await CourseModel.find({ _id: req.params.id });

//     // extract timeline id of the course
//     const courseTimelineId = course[0].timeline;

//     // find timeline of the course
//     const timeline = await TimelineModel.find({ _id: courseTimelineId });

//     // create new array of tasks for user based-on timeline's array of tasks
//     timeline.tasks.forEach((task) => {
//       currTaskStats = [
//         ...currTaskStats,
//         {
//           originalTaskId: task._id,
//           userTaskSatus: task.status,
//           userTaskSatus: 0,
//         },
//       ];
//     });
//     console.log(currTaskStats);

//     // create new array of tasks for user based-on timeline's array of tasks
//     timeline.milestones.forEach((milestone) => {
//       currMilestioneStats = [
//         ...currMilestioneStats,
//         {
//           originalTaskId: milestone._id,
//           userTaskSatus: milestone.status,
//         },
//       ];
//     });
//     console.log(currMilestioneStats);

//     // create user timeline based on existing timeline
//     const newTimelineUser = TimelineUserModel({
//       origin: courseTimelineId,
//       userTasksStats: currTaskStats,
//       userMilestonesStatus: currMilestioneStats,
//     });
//     console.log(newTimelineUser);

//     // save new user timeline
//     await newTimelineUser.save();

//     // create new subscriber-course-usertimeline relation
//     const newSubscriberAndCourse = CourseUserModel({
//       subscriber: req.body._id,
//       course: req.params.id,
//       timeline: newTimelineUser._id,
//     });
//     console.log(newSubscriberAndCourse);

//     // save new subscriber-course-usertimeline relation
//     await newSubscriberAndCourse.save();

//     res.status(200).json({ msg: "User subscribed to the course" });
//   } catch (err) {
//     res.status(500).send("Server error. Request could not be fulfilled.");
//   }
// });
// Take course
app.route("/courses/:id/takecourse").post(async (req, res) => {
  // IMPROVEMENT: user data could be received from req.session.user directly (to check)
  // IMPROVEMENT: would be better if we send timeline id directly
  let currTaskStats = [];
  let currMilestioneStats = [];
  try {
    // find the course user is trying to subscribe to
    const course = await CourseModel.find({ _id: req.params.id });

    // extract timeline id of the course
    const courseTimelineId = course[0].timeline;

    // find timeline of the course
    const timeline = await TimelineModel.find({ _id: courseTimelineId });

    // extract task ids of the timeline
    const timelineTaskIds = timeline[0].tasks;

    // find timeline of the course
    const tasks = await TaskModel.find({ _id: timelineTaskIds });

    // create new array of tasks for user based-on timeline's array of tasks
    tasks.forEach((task) => {
      currTaskStats = [
        ...currTaskStats,
        {
          originalTaskId: task._id,
          userTaskSatus: task.status,
          userTaskSatus: 0,
        },
      ];
    });
    console.log(currTaskStats);

    // create new array of tasks for user based-on timeline's array of tasks
    timeline.milestones.forEach((milestone) => {
      currMilestioneStats = [
        ...currMilestioneStats,
        {
          originalTaskId: milestone._id,
          userTaskSatus: milestone.status,
        },
      ];
    });
    // console.log(currMilestioneStats);

    // create user timeline based on existing timeline
    const newTimelineUser = TimelineUserModel({
      origin: courseTimelineId,
      userTasksStats: currTaskStats,
      userMilestonesStatus: currMilestioneStats,
    });
    console.log(newTimelineUser);

    // save new user timeline
    await newTimelineUser.save();

    // create new subscriber-course-usertimeline relation
    const newSubscriberAndCourse = CourseUserModel({
      subscriber: req.body._id,
      course: req.params.id,
      timeline: newTimelineUser._id,
    });
    console.log(newSubscriberAndCourse);

    // save new subscriber-course-usertimeline relation
    await newSubscriberAndCourse.save();

    res.status(200).json({ msg: "User subscribed to the course" });
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
});

// Create course
app.route("/courses/create").post(checkAuth, async (req, res) => {
  // MAKE-SURE: req.body has name, description and owner (timeline can be emptys at creation)
  // EXAMPLE: {
  //     "name": "test",
  //     "description": "test",
  //     "owner": "6496f1ae73f6e014598d9630"
  //  }
  let newCourse;
  try {
    // create empty timeline
    const newTimeline = new TimelineModel();

    // save new empty timeline
    await newTimeline.save();

    // add new timeline's id to the course
    req.body["timeline"] = newTimeline._id;

    // create new course
    newCourse = new CourseModel(req.body);

    // create new course
    await newCourse.save();
    res.status(200).json(newCourse);
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
});

// Get specific course
app.route("/courses/:id").get(checkAuth, async (req, res) => {
  let course;
  try {
    course = await CourseModel.find({ _id: req.body._id });
    res.status(200).json(course);
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
});

// Get all courses
app.route("/courses").get(checkAuth, async (req, res) => {
  let courses = [];
  try {
    courses = await CourseModel.find({});
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
});

// Simple route to destory session
app.route("/logout").get(async (req, res) => {
  try {
    // destroy session all together
    await req.session.destroy();

    // delete session from db
    req.session = null;

    res.status(200).json({ msg: "Logged out." });
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
});

// Simple Auth routeGet all courses
app.route("/isAuth").get(isAuth);

// Get a specific user
app.route("/login").post(async (req, res) => {
  try {
    // check if user exists
    const user = await UserModel.findOne({ email: req.body.email });

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
      const userSession = { _id: user._id, email: user.email };

      // attach new session to express-session
      req.session.user = userSession;

      // status, message and new session (as a cookie) sent to frontend
      return res
        .status(200)
        .json({ msg: "You have logged in successfully", userSession });
    } else {
      return res.status(400).json({ msg: "Invalid credential" });
    }
  } catch (err) {
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
});
