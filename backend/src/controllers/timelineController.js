// This controller implements all API calls to related to updating Timeline of courses and users
const TimelineModel = require("../models/dbTimeline");
const TaskModel = require("../models/dbTasks");
const MilestoneModel = require("../models/dbMilestones");
const TimelineUserModel = require("../models/dbTimelineUser");
const fs = require("fs");

// Create Task
exports.createTask = async (req, res) => {
  // prepare general task data
  let taskData = {
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    data: new Date(req.body.data),
    timeline: req.params.timelineId,
  };

  // add any fields for specific tasks
  if (req.body.type === "Quiz") {
    taskData.description = "quizDesc";
    taskData.questions = req.body.text;
    if (Array.isArray(req.body.answers)) {
      taskData.answers = req.body.answers.map((answer) => {
        return JSON.parse(answer);
      });
    } else {
      taskData.answers = [JSON.parse(req.body.answers)];
    }
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
  let newTask;
  let subscriberTimelines = req.body.subscriberTimelines.split(",");
  console.log("req.files: ", req.files);
  console.log("req.body: ", req.body);
  // console.log("taskData: ", taskData);
  // console.log("req.body.answers: ", req.body.answers);
  // var test = req.body.answers.map((answer) => {
  //   return JSON.parse(answer);
  // });
  // console.log("JSON.parse(req.body.answers) in a map: ", test);
  try {
    // create new task
    newTask = new TaskModel(taskData);

    // save task in db
    const resultNewTask = await newTask.save();

    // check task creation in db
    if (!resultNewTask) {
      res.status(400).json({ msg: "New Task not created" });
    }
    // console.log("resultNewTask: ", resultNewTask);

    let toPush = [];
    // extract names of saved files
    const currFileNames = req.files.map((file) => file.filename);
    // console.log("currFileNames: ", currFileNames);

    // rename each field to contain id of the task
    currFileNames.forEach((fileName, idx) => {
      var oldFileNameArr = fileName.split("_");
      // console.log("oldFileName: ", `./public/${fileName}`);
      // console.log(
      //   "newFileName: ",
      //   `./public/${resultNewTask._id}_${oldFileNameArr[1]}`
      // );
      // newFileNames = [
      //   ...newFileNames,
      //   `${resultNewTask._id}_${oldFileNameArr[1]}`,
      // ];

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
    // console.log("done");
    // console.log("original filenames: ", originalFileNames);
    // console.log("toPush: ", toPush);
    // find task model and update the list of filenames
    const resultUpdateTask = await TaskModel.findByIdAndUpdate(newTask._id, {
      $push: {
        files: {
          $each: toPush,
        },
      },
    });

    if (!resultUpdateTask) {
      res
        .status(400)
        .json({ msg: "Taskmodel not updated (filenames were not added)" });
    }
    console.log("resultUpdateTask: ", resultUpdateTask);

    // find timeline and add the new task to it
    const result = await TimelineModel.findByIdAndUpdate(
      req.params.timelineId,
      {
        $push: {
          tasks: newTask,
        },
      }
    );
    if (!result) {
      res
        .status(400)
        .json({ msg: "Timeline not updated (assignment was not added)" });
    }

    // console.log(resultUpdateTask);
    // console.log(result);
    // console.log("subscriberTimelines: ", subscriberTimelines);
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

      // add new task status to the user's timeline
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
      if (!result) {
        res.status(400).json({
          msg: "User Timeline not updated (assignment was not added)",
        });
      }
    }
    res.status(200).json({ msg: "Task created" });
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
};

// Create milestone
exports.createMilestone = async (req, res) => {
  // prepare milestone data
  let milestoneData = {
    type: req.body.type,
    data: req.body.data,
    timeline: req.params.timelineId,
  };
  let subscriberTimelines = req.body.subscriberTimelines;
  let newMilestone;
  try {
    // create new task
    newMilestone = new MilestoneModel(milestoneData);

    // save task in db
    await newMilestone.save();

    // find timeline of the course and add milestone to it
    const result = await TimelineModel.findByIdAndUpdate(
      req.params.timelineId,
      {
        $push: {
          milestones: newMilestone,
        },
      }
    );
    if (!result) {
      res
        .status(400)
        .json({ msg: "Timeline not updated (milestone was not added)" });
    }

    let subscriberTimelineId;
    // parse each subscriber's timeline
    for (var subscriberTimeline in subscriberTimelines) {
      if (Array.isArray(subscriberTimelines)) {
        subscriberTimelineId = subscriberTimelines[subscriberTimeline];
      } else {
        subscriberTimelineId = subscriberTimelines;
      }

      // add new milestone status to the user's timeline
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
      if (!result) {
        res.status(400).json({
          msg: "User Timeline not updated (milestone was not added)",
        });
      }
    }
    res.status(200).json({ msg: "New milestone added to DB" });
  } catch (err) {
    res.status(500).send("Server error. Request could not be fulfilled.");
  }
};

// Take Task
exports.takeTask = async (req, res) => {
  // if user uploaded any files, rename them to include id of task
  if (req.files && req.files.length > 0) {
    console.log("req.files: ", req.files);
    console.log("req.files.length > 0: ", req.files.length > 0);
    fs.rename(
      `./public/${req.files[0].filename}`,
      `./public/${req.params.taskId}_${
        req.files[0].filename.split("_")[1].split(".")[0]
      }_uploaded`,
      function (err) {
        if (err) console.log("ERROR: " + err);
      }
    );
  }

  // prepare parameters for update API call
  const setParams = req.files
    ? {
        "userTasksStats.$.userTaskSatus": "done",
        "userTasksStats.$.userTaskScore": req.body.score,
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
  const taskId = req.params.taskId;
  console.log("setParams: ", setParams);
  // const dataToUpdate = { userTaskSatus: "done" };
  // console.log("dataToUpdate: ", dataToUpdate);
  console.log("req.body: ", req.body);
  console.log("userID: ", req.session.user.id);
  try {
    // update status of task in user's timeline
    const userTimeline = await TimelineUserModel.findOneAndUpdate(
      {
        userId: req.session.user.id,
        origin: req.body.timelineId,
        "userTasksStats.originalTaskId": taskId,
      },
      {
        $set: setParams,
      }
    );
    // console.log(userTimeline);
    if (!userTimeline) {
      res.status(400).json({ msg: "Timeline could not be updated" });
      return;
    }
    res.status(200).json({ msg: "User took the task" });
  } catch (err) {
    res.status(500).send("Something really bad happened");
  }
};

// Get Task Info
exports.getTask = async (req, res) => {
  var taskToReturn = {};
  const taskId = req.params.taskId;
  try {
    // get task from db
    const task = await TaskModel.findOne({ _id: taskId });
    if (!task) {
      res.status(400).json({ msg: "A task with that id doesn't exist yet" });
      return;
    }
    console.log("task: ", task);

    // set common task fields
    taskToReturn._id = task._id;
    taskToReturn.title = task.title;
    taskToReturn.deadline = task.data;

    // set different fields
    if (task.type === "Assignment") {
      taskToReturn.description = task.description;
      taskToReturn.files = task.files;
    } else {
      taskToReturn.questions = [];
      console.log("task.correctAnswers: ", task.correctAnswers);
      for (let i = 0; i < task.questions.length; i++) {
        console.log("task.correctAnswers[i]: ", task.correctAnswers[i]);
        taskToReturn.questions = [
          ...taskToReturn.questions,
          {
            text: task.questions[i],
            answers: task.answers[i],
            correctAnswerIndices: task.correctAnswers[i],
            image: i >= task.files.length ? null : task.files[i],
          },
        ];
      }
    }
    res
      .status(200)
      .json({ task: taskToReturn, msg: "Task returned successfully" });
  } catch (err) {
    res.status(500).send("Something really bad happened");
  }
};
