// This controller implements all API calls to retreive info from and create courses
const UserModel = require("../models/dbUsers");
const CourseModel = require("../models/dbCourses");
const TimelineModel = require("../models/dbTimeline");
const TaskModel = require("../models/dbTasks");
const MilestoneModel = require("../models/dbMilestones");
const TimelineUserModel = require("../models/dbTimelineUser");
const CourseUserModel = require("../models/dbCourseUser");

// Take course
exports.takeCourse = async (req, res) => {
  let currTaskStats = [];
  let currMilestioneStats = [];
  try {
    // find the course user is trying to subscribe to
    const course = await CourseModel.findOne({ _id: req.params.courseId });

    // extract timeline id of the course
    const courseTimelineId = course.timeline;

    // find timeline of the course
    const timeline = await TimelineModel.findOne({ _id: courseTimelineId });

    // extract task ids of the timeline
    const timelineTaskIds = timeline.tasks;

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
    const milestoneTaskIds = timeline.milestones;

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
      userId: req.body.userId,
    });
    // console.log(newTimelineUser);

    // save new user timeline
    await newTimelineUser.save();

    // create new subscriber-course-usertimeline relation
    const newSubscriberAndCourse = CourseUserModel({
      subscriber: req.body.userId,
      course: req.params.courseId,
      usertimeline: newTimelineUser._id,
    });
    // console.log(newSubscriberAndCourse);

    // save new subscriber-course-usertimeline relation
    await newSubscriberAndCourse.save();

    res.status(200).json({ msg: "User subscribed to the course" });
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
};

// Get data of all subscribers of a course
exports.getAllSubscriberData = async (req, res) => {
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
};

// Create course
exports.createCourse = async (req, res) => {
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
};

// Get id, name and descriptions of all courses
exports.getCourseIdNameDescs = async (req, res) => {
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
};

// Get all information of a course (parsed to the needs of a frontend)
exports.getCourseAllInfo = async (req, res) => {
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
    course.timeline = { _id: timelineID, tasks: tasks, milestones: milestones };
    // console.log(course);
    res.status(200).json(course);
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
};
