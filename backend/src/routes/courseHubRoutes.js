const express = require("express");

// create express router
const router = express.Router();

// import all controllers
const loginRegisterController = require("../controllers/loginRegisterController");
const courseController = require("../controllers/courseController");
const timelineController = require("../controllers/timelineController");

// import all middlewares
const checkAuthMiddleware = require("../middleware/checkAuth");
const isAuthMiddleware = require("../middleware/isAuth");
const uploadFileMiddleware = require("../middleware/uploadFile");
const downloadFileMiddleware = require("../middleware/downloadFile");

// route to login
router.post("/login", loginRegisterController.login);

// route to register
router.post("/register", loginRegisterController.register);

// route to logout
router.get("/logout", loginRegisterController.logout);

// route for frontend to check for any existing session
router.get("/isAuth", isAuthMiddleware.isAuth);

// route to take a course
router.post(
  "/takeCourse/:courseId",
  checkAuthMiddleware.checkAuth,
  courseController.takeCourse
);

// route to get all subscriber data of a course
router.get(
  "/allSubscriberData/:courseId",
  checkAuthMiddleware.checkAuth,
  courseController.getAllSubscriberData
);

// route to create a course
router.post(
  "/courses/create",
  checkAuthMiddleware.checkAuth,
  courseController.createCourse
);

// route to get general info on all courses
router.get(
  "/courseIdDescs",
  checkAuthMiddleware.checkAuth,
  courseController.getCourseIdNameDescs
);

// route to get all info of a course
router.get(
  "/courseAllInfo/:courseId",
  checkAuthMiddleware.checkAuth,
  courseController.getCourseAllInfo
);

// route to create a task
router.post(
  "/courseAddTask/:timelineId",
  checkAuthMiddleware.checkAuth,
  uploadFileMiddleware.upload.array("allFiles"),
  timelineController.createTask
);

// route to create a milestone
router.post(
  "/courseAddMilestone/:timelineId",
  checkAuthMiddleware.checkAuth,
  timelineController.createMilestone
);

// route to take a task
router.post(
  "/courseTakeTask/:taskId",
  checkAuthMiddleware.checkAuth,
  uploadFileMiddleware.upload.array("allFiles"),
  timelineController.takeTask
);

// route to get task info
router.get(
  "/courseGetTask/:taskId",
  checkAuthMiddleware.checkAuth,
  timelineController.getTask
);

// route to download files
router.get(
  "/download/:filename/:originalfilename",
  checkAuthMiddleware.checkAuth,
  downloadFileMiddleware.downloadFile
);

module.exports = router;
