// This controller implements all API calls to related to updating Timeline of courses and users
const TimelineModel = require("../models/dbTimeline");
const TaskModel = require("../models/dbTasks");
const MilestoneModel = require("../models/dbMilestones");
const TimelineUserModel = require("../models/dbTimelineUser");
const fs = require("fs");

/**
 * @function
 * The `createTask` function is an API controller that creates a new milestone for a course.
 * First data needed to create a new task is prepared. If a quiz is to be created, the
 * array of question objects are untangled to create arrays of question texts and correct
 * indices. Then a task is created. Later on, the uploaded files are correctly renamed and the new
 * filenames are updated for the task. Finally, the new task is added to the timeline of the course
 * and to the user timeline of each subscriber.
 * @typedef {object} createTaskParams
 * @property {string} timelineId this is id of the timeline for the respective course.
 *
 * @typedef {object} createTaskBody
 * @property {string} type this is type of the task.
 * @property {string} title this is title of the task.
 * @property {string} description this is description of the task.
 * @property {string} data this is due date of the task.
 * @property {[string]} text this is (an array of) all question texts for a quiz (only set for quiz
 * type).
 * @property {[string]} answers this is (an array of) all options for all questions of a quiz (only
 * set for a quiz type).
 * @property {[string]} correctAnswerIndices this is (an array) of all options for a questions of
 * a quiz (only set for a quiz type).
 * @property {[string]} subscriberTimelines this is array of user timeline ids for each subscriber
 * of the course.
 *
 * @param {import('express').Request<createTaskParams, {}, createTaskBody, {}} req
 * @param req.params.timelineId {String} URL parameter as the id of the timeline for the respective course.
 * @param req.body.type {Number} JSON payload field with type of the milestone.
 * @param req.body.data {String} JSON payload field with due date of the milestone.
 * @param req.body.text {[String]} JSON payload field with question texts for a quiz (only set for quiz
 * type).
 * @param req.body.answers {String} JSON payload field with options for all questions of a quiz (only
 * set for a quiz type). For quiz with multiple questions, this is an array.
 * @param req.body.correctAnswerIndices {String} JSON payload field with all options for a questions of
 * a quiz (only set for a quiz type). For quiz with multiple questions, this is an array.
 * @param req.body.subscriberTimelines {[String]} JSON payload field as array of strings with
 * user timeline ids for each subscriber of the course.
 * @param req.files {Object} array of one with JSON object containing two fields: "filename" and
 * "originalname". Both fields are strings and contain the original name of the uploaded field.
 *
 * @param res {Object} The response object with a status and JSON object with a message field.
 * If function is successful, the status is 200 alongside an appropriate message. If as a result of an
 * update operation, no object is changed, the status is 400 with an appropriate message.
 * If any DB operation fails to execute, the status is set to 500, and the default error
 * message "Server error. Request could not be fulfilled." is set.
 */
exports.createTask = async (req, res) => {
  // prepare general task data
  let taskData = {
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    data: new Date(req.body.data),
    timeline: req.params.timelineId,
  };

  // add any fields for specific task types
  if (req.body.type === "Quiz") {
    // dummy field desc for each quiz
    taskData.description = "quizDesc";
    taskData.questions = req.body.text;

    // extract answers from each question object to create an array
    if (Array.isArray(req.body.answers)) {
      taskData.answers = req.body.answers.map((answer) => {
        return JSON.parse(answer);
      });
    } else {
      taskData.answers = [JSON.parse(req.body.answers)];
    }

    // extract correct answers from each question object to create array of arrays
    // where first array refers to a question and the second to correct indices
    if (Array.isArray(req.body.answers)) {
      taskData.correctAnswers = req.body.correctAnswerIndices.map(
        (correctIndex) => {
          return JSON.parse(correctIndex);
        }
      );
    } else {
      taskData.correctAnswers = [JSON.parse(req.body.correctAnswerIndices)];
    }
  }

  // variable for new task
  let newTask;

  // ids of timeline of all subscribers
  let subscriberTimelines = req.body.subscriberTimelines.split(",");
  try {
    // create new task
    newTask = new TaskModel(taskData);

    // save task in db
    const resultNewTask = await newTask.save();

    // check task creation in db
    if (!resultNewTask) {
      res.status(400).json({ msg: "New Task not created" });
    }

    let toPush = [];
    // extract names of saved files
    const currFileNames = req.files.map((file) => file.filename);

    // rename each field to contain id of the task
    currFileNames.forEach((fileName, idx) => {
      var oldFileNameArr = fileName.split("_");

      toPush = [
        ...toPush,
        {
          originalFileName: req.files[idx].originalname,
          fileName: `${resultNewTask._id}_${oldFileNameArr[1]}`,
        },
      ];
      fs.rename(
        `./public/${fileName}`,
        `./public/${resultNewTask._id}_${oldFileNameArr[1]}`,
        function (err) {
          if (err) console.log("ERROR: " + err);
        }
      );
    });

    // find task model and update the list of filenames
    const resultUpdateTask = await TaskModel.findByIdAndUpdate(newTask._id, {
      $push: {
        files: {
          $each: toPush,
        },
      },
    });

    // check if the update was successful
    if (!resultUpdateTask) {
      res
        .status(400)
        .json({ msg: "Taskmodel not updated (filenames were not added)" });
    }

    // find timeline and add the new task to it
    const result = await TimelineModel.findByIdAndUpdate(
      req.params.timelineId,
      {
        $push: {
          tasks: newTask,
        },
      }
    );

    // check if the update was successful
    if (!result) {
      res
        .status(400)
        .json({ msg: "Timeline not updated (assignment was not added)" });
    }

    let subscriberTimelineId;

    // parse each subscriber's timeline
    for (var subscriberTimeline in subscriberTimelines) {
      // get id of each subscriberTimelineId (if-statement needed for the case of only 1 subscriber)
      if (Array.isArray(subscriberTimelines)) {
        subscriberTimelineId = subscriberTimelines[subscriberTimeline];
      } else {
        subscriberTimelineId = subscriberTimelines;
      }
      if (subscriberTimelineId === "") {
        break;
      }
      // console.log("subscriberTimelineId: ", subscriberTimelineId);

      // add new task with its status to the user's timeline
      const result = await TimelineUserModel.findByIdAndUpdate(
        subscriberTimelineId,
        {
          $push: {
            userTasksStats: {
              originalTaskId: newTask._id,
              userTaskSatus: newTask.status,
              userTaskScore: 0,
            },
          },
        }
      );

      // check if the update was successful
      if (!result) {
        res.status(400).json({
          msg: "User Timeline not updated (assignment was not added)",
        });
      }
    }
    res.status(200).json({ msg: "Task created" });
  } catch (err) {
    res
      .status(500)
      .send({ msg: "Server error. Request could not be fulfilled." });
  }
};

/**
 * @function
 * The `createMilestone` function is an API controller that creates a new milestone for a course.
 * The milestone is first created and added to the timeline of the course. Then to each timeline of
 * the subscribers are iterated and the new milestone (id and status) is added.
 * @typedef {object} createMilestoneParams
 * @property {string} timelineId this is id of the timeline for the respective course.
 *
 * @typedef {object} createMilestonekBody
 * @property {string} type this is type of the milestone.
 * @property {string} data this is due date of the milestone.
 * @property {[string]} subscriberTimelines this is array of user timeline ids for each subscriber
 * of the course.
 *
 * @param {import('express').Request<createMilestoneParams, {}, createMilestonekBody, {}} req
 * @param req.params.timelineId {String} URL parameter as the id of the timeline for the respective course.
 * @param req.body.type {Number} JSON payload field with type of the milestone.
 * @param req.body.data {String} JSON payload field with due date of the milestone.
 * @param req.body.subscriberTimelines {[String]} JSON payload field as array of strings with
 * user timeline ids for each subscriber of the course.
 *
 * @param res {Object} The response object with a status and JSON object with a message field.
 * If function is successful, the status is 200 alongside an appropriate message. If as a result of an
 * update operation, no object is changed, the status is 400 with an appropriate message.
 * If any DB operation fails to execute, the status is set to 500, and the default error
 * message "Server error. Request could not be fulfilled." is set.
 */
exports.createMilestone = async (req, res) => {
  // prepare milestone data
  let milestoneData = {
    type: req.body.type,
    data: req.body.data,
    timeline: req.params.timelineId,
  };

  // user timeline ids for each subscriber of the course
  let subscriberTimelines = req.body.subscriberTimelines;

  // variable to hold new milestone
  let newMilestone;
  try {
    // create new task
    newMilestone = new MilestoneModel(milestoneData);

    // save task in db
    await newMilestone.save();

    // find timeline of the course and add new milestone to it
    const result = await TimelineModel.findByIdAndUpdate(
      req.params.timelineId,
      {
        $push: {
          milestones: newMilestone,
        },
      }
    );

    // check if the update was successful
    if (!result) {
      res
        .status(400)
        .json({ msg: "Timeline not updated (milestone was not added)" });
    }

    // variable to hold each user timeline
    let subscriberTimelineId;

    // parse each subscriber's timeline (for-loop used, since there is an asynchronous
    // function inside the loop)
    for (var subscriberTimeline in subscriberTimelines) {
      // workaround for if there is only one subscriber
      if (Array.isArray(subscriberTimelines)) {
        subscriberTimelineId = subscriberTimelines[subscriberTimeline];
      } else {
        subscriberTimelineId = subscriberTimelines;
      }

      // add new milestone with its status to the user's timeline
      const result = await TimelineUserModel.findByIdAndUpdate(
        subscriberTimelineId,
        {
          $push: {
            userMilestonesStats: {
              originalMilestoneId: newMilestone._id,
              userMilestoneSatus: newMilestone.status,
            },
          },
        }
      );

      // check if the update was successful
      if (!result) {
        res.status(400).json({
          msg: "User Timeline not updated (milestone was not added)",
        });
      }
    }
    res.status(200).json({ msg: "New milestone added to DB" });
  } catch (err) {
    res
      .status(500)
      .send({ msg: "Server error. Request could not be fulfilled." });
  }
};

/**
 * @function
 * The `takeTask` function is an API controller that handles a user completing a task for a course.
 * The files uploaded for an answer are first renamed appropriately. Then the parameters to update
 * the relevant entry in user timeline is prepared. Finally user timeline is updated.
 * @typedef {object} takeTaskParams
 * @property {string} taskId this is id of the task.
 *
 * @typedef {object} takeTaskBody
 * @property {number} score this is score of the task.
 * @property {string} uploadedAssignmentDescription this is description for the assignment (only set
 * if completed task is of Assignment type).
 *
 * @param {import('express').Request<takeTaskParams, takeTaskBody2, takeTaskBody, {}} req
 * @param req.params.taskId {String} URL parameter as the id of the task.
 * @param req.body.score {Number} JSON payload field with score of the task.
 * @param req.body.uploadedAssignmentDescription {String} JSON payload field with description for
 * the assignment (only set if completed task is of Assignment type).
 * @param req.files {Object} array of one with JSON object containing two fields: "filename" and
 * "originalname". Both fields are strings and contain the original name of the uploaded field.
 * @param res {Object} The response object with a status and JSON object with a message field.
 * If function was successful, the status is 200 alongside an appropriate message. If there is a
 * problem updating user timeline, the status is 400 with an appropriate message.
 * If any DB operation fails to execute, the status is set to 500, and the default error
 * message "Server error. Request could not be fulfilled." is set.
 */
exports.takeTask = async (req, res) => {
  // if user uploaded any files, rename them to include id of task
  if (req.files && req.files.length > 0) {
    fs.rename(
      `./public/${req.files[0].filename}`,
      `./public/${req.params.taskId}_${
        req.files[0].filename.split("_")[1].split(".")[0]
      }_uploaded`, // files uploaded when answering a task contain '_uploaded' substring
      function (err) {
        if (err) console.log("ERROR: " + err);
      }
    );
  }

  // prepare parameters for updating user timeline
  // '$' used to update field in an array of objects in a document
  const setParams = req.files
    ? {
        "userTasksStats.$.userTaskSatus": "done",
        "userTasksStats.$.userTaskScore": req.body.score,
        // if there is an uploaded file, create object with its original and saved name
        "userTasksStats.$.uploadedFile": {
          originalFileName:
            req.files.length > 0 ? req.files[0].originalname : undefined,
          fileName:
            req.files.length > 0
              ? `${req.params.taskId}_${
                  req.files[0].filename.split("_")[1].split(".")[0]
                }_uploaded`
              : undefined,
        },
        "userTasksStats.$.uploadedAssignmentDescription":
          req.body.uploadedAssignmentDescription,
      }
    : {
        "userTasksStats.$.userTaskSatus": "done",
        "userTasksStats.$.userTaskScore": req.body.score,
      };

  try {
    // update status of task in user's timeline
    const userTimeline = await TimelineUserModel.findOneAndUpdate(
      {
        userId: req.session.user.id,
        origin: req.body.timelineId,
        "userTasksStats.originalTaskId": req.params.taskId,
      },
      {
        $set: setParams,
      }
    );

    // check if document updated as expected
    if (!userTimeline) {
      res.status(400).json({ msg: "Timeline could not be updated" });
      return;
    }
    res.status(200).json({ msg: "User took the task" });
  } catch (err) {
    res.status(500).send({ msg: "Something really bad happened" });
  }
};

/**
 * @function
 * The `getTask` function is an API controller that retreives information of a task. The returned
 * object contains the fields "description" and "files", if it is an Assignemnt and "questions" if
 * it is a Quiz.
 * @typedef {object} getTaskParams
 * @property {string} taskId this is id of the task.
 *
 * @param {import('express').Request<getTaskParams, {}, {}, {}} req
 * @param req.params.taskId {String} URL parameter as the id of the task.
 * @param res {Object} The response object with a status and JSON object with a message field.
 * If function was successful, the status is 200 alongside an appropriate message and the task
 * object. If there is no task with given id, the status is 400 alongside an appropriate message.
 * If any DB operation fails to execute, the status is set to 500, and the default error
 * message "Server error. Request could not be fulfilled." is set.
 */
exports.getTask = async (req, res) => {
  // object to contain task
  var taskToReturn = {};
  try {
    // get task from db
    const task = await TaskModel.findOne({ _id: req.params.taskId });

    // check if task exists
    if (!task) {
      res.status(400).json({ msg: "A task with that id doesn't exist yet" });
      return;
    }

    // set common task fields
    taskToReturn._id = task._id;
    taskToReturn.title = task.title;
    taskToReturn.deadline = task.data;

    // set different fields
    if (task.type === "Assignment") {
      taskToReturn.description = task.description;
      taskToReturn.files = task.files;
    } else {
      // array to contain questions of the quiz where each question is an object
      taskToReturn.questions = [];

      // iterate over all questions
      for (let i = 0; i < task.questions.length; i++) {
        taskToReturn.questions = [
          ...taskToReturn.questions,
          // each question is an object (as frontend requires)
          {
            text: task.questions[i],
            answers: task.answers[i],
            correctAnswerIndices: task.correctAnswers[i],
            // image only set, if there are any files
            image: i >= task.files.length ? null : task.files[i],
          },
        ];
      }
    }
    res
      .status(200)
      .json({ task: taskToReturn, msg: "Task returned successfully" });
  } catch (err) {
    res.status(500).send({ msg: "Something really bad happened" });
  }
};
