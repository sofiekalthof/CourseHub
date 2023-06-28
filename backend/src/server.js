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
// const checkAuth = require("./middleware/checkAuth.js");
// const isAuth = require("./middleware/isAuth.js");
const TimelineModel = require("./models/dbTimeline.js");
const MilestoneModel = require("./models/dbMilestones.js");
const TimelineUserModel = require("./models/dbTimelineUser.js");

// Define port
const port = 3600;

// Create Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true, // needed to allow cookies to be sent between frontend/backend
};

// Add CORS to all routes and methods
app.use(cors(corsOptions));

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
      secure: false, // need an HTTPS enabled browser (true-> in prod.)
    },
    resave: true, // !!! true - force session to be saved in session store, even if it was not modified during a request
    saveUninitialized: false, // dont save session if it was not modified (i.e. no login yet)
    unset: "destroy", // delete cookie from db when it is null(completes task in a few minutes)
  })
);

// start listening to the port
app.listen(port, () => {
  console.log("Listening on " + port + ".");
});

// Function to check auth
const checkAuth = function (req, res, next) {
  // console.log(
  //   "checkAuth Called, userSession in session-store: ",
  //   req.session.user
  // );
  if (req.session.user) {
    // console.log("session exists");
    next();
  } else {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};

// Route to check auth and return user info in cookie
app.route("/isAuth").get((req, res) => {
  // console.log(
  //   "isAuth Called, userSession(req.session.user) in session-store: ",
  //   req.session.user
  // );
  // console.log("isAuth Called, req.session in session-store: ", req.session);
  if (req.session.user) {
    return res.status(200).json(req.session.user);
  } else {
    return res.status(401).json({ msg: "Unauthorized" });
  }
});

//////////////////////// below are tested and working routes

// Get all subscriber data of a course
app.route("/allSubscriberData/:courseId").get(checkAuth, async (req, res) => {
  let subscribers = [];
  try {
    // find all subscribers of the course
    subscribers = await CourseUserModel.find({
      course: req.params.courseId,
    }).lean();

    // parse and edit subscribers to ready them for frontend
    // for loop as such neccessary due to async. functions inside (alternative: forEach with promise -> not working)
    for (var subscriberId in subscribers) {
      let subscriber = subscribers[subscriberId];

      // extract user timeline's id
      const userTimelineID = subscriber.usertimeline;

      // get timeline of user for this course
      const userTimeline = await TimelineUserModel.findOne({
        _id: userTimelineID,
      });

      // extract user id
      const userID = subscriber.subscriber;

      // get timeline of user for this course
      const user = await UserModel.findOne({
        _id: userID,
      });

      // replace timeline field with tasks
      subscriber.usertimeline = { usertimeline: userTimeline };

      // add username as a new field
      subscriber.username = user.username;
    }
    res
      .status(200)
      .json({ msg: "all subscriber data returned", subscribers: subscribers });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Server error. Request could not be fulfilled." });
  }
});

// Create course
app.route("/courses/create").post(checkAuth, async (req, res) => {
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

    // convert document to JSON object (to make it editable)
    let newCourseJSON = newCourse.toJSON();

    // remove unnecessary fields
    delete newCourse.timeline;
    delete newCourse.owner;

    res.status(200).json({ msg: "New course added", newCourse: newCourseJSON });
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
});

// Get all courses (returns only id, name and descriptions)
app.route("/courseIdDescs").get(checkAuth, async (req, res) => {
  let courses = [];
  try {
    // find all courses
    courses = await CourseModel.find({}).lean(); // lean neccessary to make courses editable(for replacing timeline with real tasks and milestones)

    // parse and edit courses to ready them for frontend
    // for loop as such neccessary due to async. functions inside (alternative: forEach with promise -> not working)
    for (var courseIdx in courses) {
      let course = courses[courseIdx];

      // remove unnecessary fields
      delete course.timeline;
      delete course.owner;
    }
    // console.log("backend sends: ", courses);
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
});

// Get all information of a course (parsed to the needs of a frontend) (POSTMAN Checked)
app.route("/courseAllInfo/:courseId").get(checkAuth, async (req, res) => {
  let course = [];
  try {
    // find all courses
    course = await CourseModel.findOne({ _id: req.params.courseId }).lean(); // lean neccessary to make courses editable(for replacing timeline with real tasks and milestones)

    //// parse and edit course to ready them for frontend
    // extract course's timeline id
    const timelineID = course.timeline;

    // get timeline of a course
    const timeline = await TimelineModel.findOne({ _id: timelineID });

    // extract task ids of timeline
    const taskIds = timeline.tasks;

    // extract milestone ids of timeline
    const milestoneIds = timeline.milestones;

    let tasks = [];
    // if there are any tasks in the course, parse them
    if (taskIds) {
      // for each taskId
      for (var taskId in taskIds) {
        // find task itself
        let task = await TaskModel.findOne({ _id: taskIds[taskId] });

        // append to list
        tasks = [...tasks, task];
      }
    }

    let milestones = [];
    // if there are any tasks in the course, parse them
    if (milestoneIds) {
      // for each taskId
      for (var milestoneId in milestoneIds) {
        // find task itself
        let milestone = await MilestoneModel.findOne({
          _id: milestoneIds[milestoneId],
        });

        // append to list
        milestones = [...milestones, milestone];
      }
    }

    // replace timeline field with tasks
    course.timeline = { tasks: tasks, milestones: milestones };
    // console.log(course);
    res.status(200).json(course);
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
      const userSession = { id: user._id };

      // attach new session to express-session
      req.session.user = userSession;
      console.log("Session in store after login: ", req.session);

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

//////////////////////// below are to-be-tested/to-be-implemented routes

// Get all courses
// app.route("/courses").get(async (req, res) => {
//   let courses = [];
//   try {
//     // find all courses
//     courses = await CourseModel.find({}).lean(); // lean neccessary to make courses editable(for replacing timeline with real tasks and milestones)

//     // parse and edit courses to ready them for frontend
//     // for loop as such neccessary due to async. functions inside (alternative: forEach with promise -> not working)
//     for (var courseIdx in courses) {
//       let course = courses[courseIdx];

//       // extract course's timeline id
//       const timelineID = course.timeline;

//       // get timeline of a course
//       const timeline = await TimelineModel.find({ _id: timelineID });

//       // extract task ids of timeline
//       const taskIds = timeline[0].tasks;

//       // extract milestone ids of timeline
//       const milestoneIds = timeline[0].milestones;

//       let tasks = [];
//       // if there are any tasks in the course, parse them
//       if (taskIds) {
//         // for each taskId
//         for (var taskId in taskIds) {
//           // find task itself
//           let task = await TaskModel.findOne({ _id: taskIds[taskId] });

//           // append to list
//           tasks = [...tasks, task];
//         }
//       }

//       let milestones = [];
//       // if there are any tasks in the course, parse them
//       if (milestoneIds) {
//         // for each taskId
//         for (var milestoneId in milestoneIds) {
//           // find task itself
//           let milestone = await MilestoneModel.findOne({
//             _id: milestoneIds[milestoneId],
//           });

//           // append to list
//           milestones = [...milestones, milestone];
//         }
//       }

//       // replace timeline field with tasks
//       course.timeline = { tasks: tasks, milestones: milestones };
//     }
//     res.status(200).json(courses);
//   } catch (err) {
//     res.status(500).send("Server error. Request could not be fulfilled.");
//   }
// });
// Update milestone(autom.)?

// Take task

// Create task (POSTMAN checked)
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

    // TODO: update all subs timelines

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
});

// Create milestone (POSTMAN checked)
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

    // TODO: update all subs timelines

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
});

// // Take course (POSTMAN checked)
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
          userTaskScore: 0,
        },
      ];
    });
    // console.log("current Task stats: ", currTaskStats);

    // extract task ids of the timeline
    const milestoneTaskIds = timeline[0].milestones;

    // find timeline of the course
    const milestones = await MilestoneModel.find({ _id: milestoneTaskIds });

    // create new array of tasks for user based-on timeline's array of tasks
    milestones.forEach((milestone) => {
      currMilestioneStats = [
        ...currMilestioneStats,
        {
          originalMilestoneId: milestone._id,
          userMilestoneSatus: milestone.status,
        },
      ];
    });
    // console.log("current milestones: ", currMilestioneStats);

    // create user timeline based on existing timeline
    const newTimelineUser = TimelineUserModel({
      origin: courseTimelineId,
      userTasksStats: currTaskStats,
      userMilestonesStats: currMilestioneStats,
    });
    // console.log(newTimelineUser);

    // save new user timeline
    await newTimelineUser.save();

    // create new subscriber-course-usertimeline relation
    const newSubscriberAndCourse = CourseUserModel({
      subscriber: req.body._id,
      course: req.params.id,
      usertimeline: newTimelineUser._id,
    });
    // console.log(newSubscriberAndCourse);

    // save new subscriber-course-usertimeline relation
    await newSubscriberAndCourse.save();

    res.status(200).json({ msg: "User subscribed to the course" });
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
});

// For debugging user authentification
// TODO: delete later
// app.route("/rando").get((req, res) => {
//   req.session.user = { userId: req.id };
//   console.log(
//     "rando Called, userSession(req.session.user) in session-store: ",
//     req.session.user
//   );
//   console.log("rando Called, req.session in session-store: ", req.session);
//   return res.status(200).json({ test: "abc", lol: req.session });
// });

// Express-session without store capabilities (still there for auth. debugging)
// TODO: delete later
// app.use(
//   session({
//     secret: "kekw",
//     resave: true, // true - force session to be saved in session store, even if it was not modified during a request
//     saveUninitialized: false, // save session if it was not modified (i.e. no login yet)
//   })
// );
