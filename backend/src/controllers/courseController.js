// This controller implements all API calls to retreive info from and create courses
const UserModel = require("../models/dbUsers");
const CourseModel = require("../models/dbCourses");
const TimelineModel = require("../models/dbTimeline");
const TaskModel = require("../models/dbTasks");
const MilestoneModel = require("../models/dbMilestones");
const TimelineUserModel = require("../models/dbTimelineUser");
const CourseUserModel = require("../models/dbCourseUser");

/**
 * @function
 * The `takeCourse` function is an API controller that handles the logic for a user to subscribe to a
 * course. The function extracts the current status of tasks and milestones of a course which is
 * used to create timeline for the user. Finally the relation between the course, user and user's
 * timeline is recorder.
 * @typedef {object} takeCourseBody
 * @property {string} userId this is id of the user trying to subscribe.
 *
 * @typedef {object} takeCourseParams
 * @property {string} courseId this is id of the course being subscribed to.
 *
 * @param {import('express').Request<takeCourseParams, {}, takeCourseBody, {}} req
 * @param req.params.courseId {String} URL parameter as the id of the course being subscribed to.
 * @param req.body.userId {Object} JSON payload field with the id of the user trying to subscribe.
 * @param res {Object} The response object with a status and JSON object with a message field.
 * If function was successful The status is 200 alongside an appropriate message. If any DB operation fails
 * to execute, the status is set to 500, and the default error message "Server error. Request
 * could not be fulfilled." is set.
 */
exports.takeCourse = async (req, res) => {
  // variables to hold current status of tasks and milestones
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

    /* create new array of tasks for user based-on timeline's array of tasks

    */
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

    // extract task ids of the timeline
    const milestoneTaskIds = timeline.milestones;

    // find timeline of the course
    const milestones = await MilestoneModel.find({ _id: milestoneTaskIds });

    // create new array of tasks for user (based-on course's timeline)
    milestones.forEach((milestone) => {
      currMilestioneStats = [
        ...currMilestioneStats,
        {
          originalMilestoneId: milestone._id,
          userMilestoneSatus: milestone.status,
        },
      ];
    });

    // create user timeline
    const newTimelineUser = TimelineUserModel({
      origin: courseTimelineId,
      userTasksStats: currTaskStats,
      userMilestonesStats: currMilestioneStats,
      userId: req.body.userId,
    });

    // save new user timeline
    await newTimelineUser.save();

    // create new subscriber-course-usertimeline relation
    const newSubscriberAndCourse = CourseUserModel({
      subscriber: req.body.userId,
      course: req.params.courseId,
      userTimeline: newTimelineUser._id,
    });

    // save new subscriber-course-usertimeline relation
    await newSubscriberAndCourse.save();

    res.status(200).json({ msg: "User subscribed to the course" });
  } catch (err) {
    res
      .status(500)
      .send({ msg: "Server error. Request could not be fulfilled." });
  }
};

/**
 * @function
 * The `getAllSubscriberData` function is an API controller that retrieves data of all subscribers of a
 * course.
 * @typedef {object} getAllSubscriberDataParams
 * @property {string} courseId this is id of the course.
 *
 * @param {import('express').Request<getAllSubscriberDataParams, {}, {}, {}} req
 * @param req.params.courseId {String} URL parameter as the id of the course.
 * @param res {Object} The response object with a status and JSON object with a message field. If function
 * was successful The status is 200 alongside an appropriate message and all the subsriber data. If any DB
 * operation fails to execute, the status is set to 500, and the default error message "Server error. Request
 * could not be fulfilled." is set.
 */
exports.getAllSubscriberData = async (req, res) => {
  // array to contain all subscriber info
  let subscribers = [];
  try {
    // find all subscribers of the course
    // lean allows treating the returned object as JSON
    subscribers = await CourseUserModel.find({
      course: req.params.courseId,
    }).lean();

    // parse and edit subscribers to ready them for frontend
    // for loop neccessary due to asynchronous functions inside
    for (var subscriberId in subscribers) {
      let subscriber = subscribers[subscriberId];

      // extract user timeline's id
      const userTimelineId = subscriber.userTimeline;

      // get timeline of user for this course
      const userTimeline = await TimelineUserModel.findOne({
        _id: userTimelineId,
      });

      // extract user id
      const userId = subscriber.subscriber;

      // get timeline of user for this course
      const user = await UserModel.findOne({
        _id: userId,
      });

      // replace timeline field with tasks
      subscriber.userTimeline = { userTimeline: userTimeline };

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

/**
 * @function
 * The `createCourse` function is an API controller that handles the logic for creating a new course.
 * @typedef {object} createCourseBody
 * @property {string} name this is name of the course.
 * @property {string} description this is description of the course.
 * @property {string} owner this is id of the owner of the course.
 *
 * @param {import('express').Request<{}, {}, {}, {}} req
 * @param req.body.name {String} JSON payload field with name of the course.
 * @param req.body.description {String} JSON payload field with description of the course.
 * @param req.body.owner {String} JSON payload field with id of the owner of the course.
 *
 * @param res {Object} The response object with a status and JSON object with a message field. If function
 * was successful The status is 200 alongside an appropriate message and relevant new course information. If any
 * DB operation fails to execute, the status is set to 500, and the default error message "Server error. Request
 * could not be fulfilled." is set.
 */
exports.createCourse = async (req, res) => {
  // variable to hold new course
  let newCourse;
  try {
    // create empty timeline
    const newTimeline = new TimelineModel();

    // save new empty timeline
    await newTimeline.save();

    // add field with new timeline's id to the course
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
    res
      .status(500)
      .send({ msg: "Server error. Request could not be fulfilled." });
  }
};

/**
 * @function
 * The `getCourseIdNameDescs` function is an API controller that retrieves the id, name, and
 * description of all courses from the database. The fields for timeline id and course owner are not
 * returned.
 *
 * @param res {Object} The response object with a status and JSON object with a message field. If function
 * was successful The status is 200 alongside infromation of all courses. If any DB operation fails to
 * execute, the status is set to 500, and the default error message "Server error. Request could not be
 * fulfilled." is set.
 */
exports.getCourseIdNameDescs = async (req, res) => {
  // array to hold all course information
  let courses = [];
  try {
    // find all courses
    // lean neccessary to make courses editable (for removing unnecessary timeline and owner information) and return JSON object
    courses = await CourseModel.find({}).lean();

    // parse and edit subscribers to ready them for frontend
    // for loop neccessary due to asynchronous functions inside
    for (var courseIdx in courses) {
      let course = courses[courseIdx];

      // remove unnecessary fields
      delete course.timeline;
      delete course.owner;
    }

    res.status(200).json(courses);
  } catch (err) {
    res
      .status(500)
      .send({ msg: "Server error. Request could not be fulfilled." });
  }
};

/**
 * @function
 * The `getCourseAllInfo` function is an API controller that retrieves all the information about a course.
 * The timeline information of the course is extracted and used to find all of the tasks and milestones
 * of the course. This information is added to the returned object.
 * @typedef {object} getCourseAllInfoParams
 * @property {string} courseId this is id of the course.
 *
 * @param {import('express').Request<getCourseAllInfoParams, {}, {}, {}} req
 * @param req.params.courseId {String} URL parameter as the id of the course.
 * @param res {Object} The response object with a status and JSON object with a message field. If function
 * was successful The status is 200 alongside all infromation for the course. If any DB operation fails to
 * execute, the status is set to 500, and the default error message "Server error. Request could not be
 * fulfilled." is set.
 */
exports.getCourseAllInfo = async (req, res) => {
  let course = [];
  try {
    // find all courses
    course = await CourseModel.findOne({ _id: req.params.courseId }).lean(); // lean neccessary to make courses editable(for replacing timeline with real tasks and milestones)

    //// parse and edit course to ready them for frontend
    // extract course's timeline id
    const timelineId = course.timeline;

    // get timeline of a course
    const timeline = await TimelineModel.findOne({ _id: timelineId });

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
    // if there are any milestones in the course, parse them
    if (milestoneIds) {
      // for each milestoneId
      for (var milestoneId in milestoneIds) {
        // find milestone itself
        let milestone = await MilestoneModel.findOne({
          _id: milestoneIds[milestoneId],
        });

        // append to list
        milestones = [...milestones, milestone];
      }
    }

    // replace timeline field with tasks
    course.timeline = { _id: timelineID, tasks: tasks, milestones: milestones };

    res.status(200).json(course);
  } catch (err) {
    res
      .status(500)
      .send({ msg: "Server error. Request could not be fulfilled." });
  }
};
