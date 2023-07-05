import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Tooltip,
  Typography,
  Box,
  Button,
  Modal,
  Backdrop,
  Fade,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  Divider,
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
import { useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
dayjs.extend(localizedFormat);

// Determine status of one task
function ShowTaskStatus(taskStatus) {
  // console.log(taskStatus);
  if (taskStatus.taskStatus == undefined) {
    return;
  }
  if (taskStatus.taskStatus.includes("due")) {
    return (
      <>
        <Tooltip title="Due">
          <AccessTimeFilledIcon sx={{ fontSize: 15, color: "orange" }} />
        </Tooltip>
      </>
    );
  }
  if (taskStatus.taskStatus.includes("done")) {
    return (
      <>
        <Tooltip title="Done">
          <CheckCircleIcon sx={{ fontSize: 15, color: "#5CDB95" }} />
        </Tooltip>
      </>
    );
  }
  if (taskStatus.taskStatus.includes("missed")) {
    return (
      <>
        <Tooltip title="Missed">
          <CancelIcon sx={{ fontSize: 15, color: "red" }} />
        </Tooltip>
      </>
    );
  }
}

function AssignmentList(props) {
  // get CourseDates as a prop from GeneralView
  const tasks = props.tasks;
  const userData = props.userDataForCourse;
  const taskStatusData =
    userData.length > 0 ? userData[0].usertimeline.usertimeline : [];
  const [areDatesDescending, setAreStatesDescending] = useState(true);

  // State to store the filter type
  const [filterType, setFilterType] = useState("");
  // Filter function to filter tasks based on type (quiz/assignment)
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
  filteredDatesWithConvertedDates.sort((a, b) => b.data - a.data);

  const [dates, setDates] = useState(filteredDatesWithConvertedDates);

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

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Function for showing the dropdown list for creating new task
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function for closing dropdown
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
                          <ShowTaskStatus taskStatus={task.taskstatus} />
                        </TableCell>
                        <TableCell>{task.dateToString}</TableCell>
                        <TableCell>{task.type}</TableCell>
                        <TableCell></TableCell>
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

export default AssignmentList;
