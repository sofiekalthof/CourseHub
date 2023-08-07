import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Tooltip,
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GetAppIcon from "@mui/icons-material/GetApp";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useEffect, useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CreateTask from "./CreateTask";
import QuizTaking from "./QuizTaking";
import AssignmentTaking from "./AssignmentTaking";
dayjs.extend(localizedFormat);

/* The `ShowTaskStatus` function is a helper function that determines the status of a task based on the
`taskStatus` parameter. It checks the value of `taskStatus.taskStatus` and returns a corresponding
icon component wrapped in a tooltip component. */
function ShowTaskStatus({ taskStatus, taskDate }) {
  const today = new Date();
  if (taskStatus.length == 0) {
    return;
  }
  if (taskStatus != "done" && taskDate < today) {
    return (
      <>
        <Tooltip title="Missed">
          <CancelIcon sx={{ fontSize: 15, color: "red" }} />
        </Tooltip>
      </>
    );
  }
  if (taskStatus == "due") {
    return (
      <>
        <Tooltip title="Due">
          <AccessTimeFilledIcon sx={{ fontSize: 15, color: "orange" }} />
        </Tooltip>
      </>
    );
  }
  if (taskStatus == "done") {
    return (
      <>
        <Tooltip title="Done">
          <CheckCircleIcon sx={{ fontSize: 15, color: "#5CDB95" }} />
        </Tooltip>
      </>
    );
  }
}

/* A React component called `AssignmentList`. It receives props such as `tasks`,
`userDataForCourse`, and `coursePageRerenderValue`. */
export default function AssignmentList(props) {
  const today = new Date();
  const tasks = props.tasks;
  const userData = props.userDataForCourse;
  const taskStatusData =
    userData.length > 0 ? userData[0].usertimeline.usertimeline : [];
  const [areDatesDescending, setAreStatesDescending] = useState(true);
  const [dates, setDates] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // State to store the filter type
  const [filterType, setFilterType] = useState("");
  /**
   * The function `filterTasks` filters tasks based on a specified filter type (quiz/assignment).
   * @returns a boolean value. If no filter type is selected (filterType is an empty string), it will
   * return true. Otherwise, it will compare the task's type (converted to lowercase) with the filterType
   * (also converted to lowercase) and return true if they match, and false otherwise.
   */
  const filterTasks = (task) => {
    if (filterType === "") {
      return true; // If no filter type is selected, show all tasks
    } else {
      return task.type.toLowerCase() === filterType.toLowerCase();
    }
  };

  // convert the Dates from a DateObject into a String for the AssignmentList
  let filteredDatesWithConvertedDates = [];
  tasks.map((task, index) => {
    // convert mongodb data string to date
    let taskTime = new Date(task.data);
    // convert date into String format for assignment list
    let convertedDate = `${taskTime.getDate()}/${
      taskTime.getMonth() + 1
    }/${taskTime.getFullYear()}`;
    // push original date, datString and taskStatus to list for displaying data in assignment list
    if (taskStatusData.length == 0) {
      filteredDatesWithConvertedDates.push({
        type: task.type,
        id: task._id,
        data: taskTime,
        dateToString: convertedDate,
        assignmentStatus: task.assignmentStatus,
        quizstatus: task.quizstatus,
        taskstatus: taskStatusData,
      });
    } else {
      filteredDatesWithConvertedDates.push({
        type: task.type,
        id: task._id,
        data: taskTime,
        dateToString: convertedDate,
        assignmentStatus: task.assignmentStatus,
        quizstatus: task.quizstatus,
        taskstatus: taskStatusData.userTasksStats[index].userTaskSatus,
      });
    }
  });

  /* The `useEffect` hook is used to perform side effects in a React component. In this case, the
`useEffect` hook is used to update the `dates` state variable whenever the
`props.coursePageRerenderValue` changes. */
  useEffect(() => {
    if (areDatesDescending) {
      setDates(filteredDatesWithConvertedDates.sort((a, b) => b.data - a.data));
    } else {
      setDates(filteredDatesWithConvertedDates.sort((a, b) => a.data - b.data));
    }
  }, [props.coursePageRerenderValue]);

  /**
   * The function `filterDates` sorts an array of dates in either ascending or descending order based
   * on a boolean flag.
   */
  const filterDates = () => {
    if (areDatesDescending) {
      setAreStatesDescending(false);
      const ascendingDates = [...dates].sort((a, b) => a.data - b.data);
      setDates(ascendingDates);
    } else {
      setAreStatesDescending(true);
      const descendingDates = [...dates].sort((a, b) => b.data - a.data);
      setDates(descendingDates);
    }
  };

  /**
   * The handleClick function sets the anchor element to the current target of the event.
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * The function handleClose sets the anchor element to null, effectively closing the dropdown.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#5CDB95" }}>
                <TableRow>
                  <TableCell> Status</TableCell>
                  <TableCell>
                    Due Date
                    {areDatesDescending ? (
                      <ArrowDownwardIcon
                        fontSize="15px"
                        onClick={filterDates}
                        sx={{ cursor: "pointer" }}
                      />
                    ) : (
                      <ArrowUpwardIcon
                        fontSize="15px"
                        onClick={filterDates}
                        sx={{ cursor: "pointer" }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    Assignment/Quiz{" "}
                    <FilterAltIcon
                      fontSize="15px"
                      onClick={handleClick}
                      sx={{ cursor: "pointer" }}
                    />
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={() => setFilterType("")}>
                        Show All
                      </MenuItem>
                      <MenuItem onClick={() => setFilterType("quiz")}>
                        Show Quizzes
                      </MenuItem>
                      <MenuItem onClick={() => setFilterType("assignment")}>
                        Show Assignments
                      </MenuItem>
                    </Menu>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* One table row for each task */}
                {dates.length == 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Alert severity="info">
                        No assignments/quizzes available for this course
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : (
                  dates
                    .filter(filterTasks) // Apply the filter
                    .map((task, index) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <ShowTaskStatus
                            taskStatus={task.taskstatus}
                            taskDate={task.data}
                          />
                        </TableCell>
                        <TableCell>{task.dateToString}</TableCell>
                        <TableCell>{task.type}</TableCell>
                        <TableCell>
                          {task.type === "Quiz" &&
                            !props.isOwner &&
                            task.data.getTime() > today.getTime() &&
                            task.taskstatus === "due" && (
                              <QuizTaking
                                dataOfAllUsersForThisCourse={
                                  props.dataOfAllUsersForThisCourse
                                }
                                takeTask={props.takeTask}
                                coursePageRerenderValue={
                                  props.coursePageRerenderValue
                                }
                                coursePageRerender={props.coursePageRerender}
                                courseTimelineId={props.courseTimelineId}
                                selectedCourseTimelineId={
                                  props.selectedCourseTimelineId
                                }
                                quizId={task.id}
                              ></QuizTaking>
                            )}
                          {task.type === "Assignment" &&
                            !props.isOwner &&
                            task.data.getTime() > today.getTime() &&
                            task.taskstatus === "due" && (
                              <AssignmentTaking
                                dataOfAllUsersForThisCourse={
                                  props.dataOfAllUsersForThisCourse
                                }
                                takeTask={props.takeTask}
                                coursePageRerenderValue={
                                  props.coursePageRerenderValue
                                }
                                coursePageRerender={props.coursePageRerender}
                                courseTimelineId={props.courseTimelineId}
                                selectedCourseTimelineId={
                                  props.selectedCourseTimelineId
                                }
                                assignmentId={task.id}
                              ></AssignmentTaking>
                            )}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}
