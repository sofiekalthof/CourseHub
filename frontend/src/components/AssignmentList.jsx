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
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
dayjs.extend(localizedFormat);

// Determine status of one task
function ShowTaskStatus(taskStatus) {
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
          <CheckCircleIcon sx={{ fontSize: 15, color: "green" }} />
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
  const taskStatusData = userData[0].usertimeline.usertimeline;
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
    let convertedDate =
      `${taskTime.getDate()}/${
        taskTime.getMonth() + 1
      }/${taskTime.getFullYear()}`
    ;

    // push original date, datString and taskStatus to list for displaying data in assignment list
    filteredDatesWithConvertedDates.push({
      type: task.type,
      id: task._id,
      data: taskTime,
      dateToString: convertedDate,
      assignmentStatus: task.assignmentStatus,
      quizstatus: task.quizstatus,
      taskstatus: taskStatusData.userTasksStats[index].userTaskSatus
    });
  });
  filteredDatesWithConvertedDates.sort((a,b) => b.data - a.data)


  const [dates, setDates] = useState(filteredDatesWithConvertedDates);

  const filterDates = () => {
    if (areDatesDescending){
      setAreStatesDescending(false);
      const ascendingDates = [...dates].sort((a,b) => a.data - b.data);
      setDates(ascendingDates);
    } else {
      setAreStatesDescending(true);
      const descendingDates = [...dates].sort((a,b) => b.data - a.data)
      setDates(descendingDates);
    }
  }

  return (
    <>
    <Button onClick={() => setFilterType("assignment")}>
          Show Assignments
        </Button>
        <Button onClick={() => setFilterType("quiz")}>Show Quizzes</Button>
        <Button onClick={() => setFilterType("")}>Show All</Button>
      <Grid container>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Due Date {areDatesDescending ? <ArrowDownwardIcon fontSize="15px" onClick={filterDates}/>: <ArrowUpwardIcon fontSize="15px" onClick={filterDates}/>}</TableCell>
                  <TableCell>Assignment/Quiz</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* One table row for each task */}
                {dates
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default AssignmentList;
