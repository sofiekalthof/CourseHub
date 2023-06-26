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
dayjs.extend(localizedFormat);

// Determine status of one task
function ShowTaskStatus({ index, userData }) {
  if (userData.length == 0) {
    return;
  }
  if (userData[0].taskStatus[index].includes("due")) {
    return (
      <>
        <Tooltip title="Due">
          <AccessTimeFilledIcon sx={{ fontSize: 15, color: "orange" }} />
        </Tooltip>
      </>
    );
  }
  if (userData[0].taskStatus[index].includes("done")) {
    return (
      <>
        <Tooltip title="Done">
          <CheckCircleIcon sx={{ fontSize: 15, color: "green" }} />
        </Tooltip>
      </>
    );
  }
  if (userData[0].taskStatus[index].includes("missed")) {
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
  // TODO(Utku): send props with tasks and milestones
  // get CourseDates as a prop from GeneralView
  const tasks = props.tasks;
  const userData = props.userDataForCourse;

  // convert the Dates from a DateObject into a String for the AssignmentList
  let filteredDatesWithConvertedDates = [];
  tasks.map((task) => {
    let convertedDates = [];
    convertedDates.push(
      `${task.data.getDate()}/${
        task.data.getMonth() + 1
      }/${task.data.getFullYear()}`
    );

    filteredDatesWithConvertedDates.push({
      type: task.type,
      id: task.id,
      data: convertedDates,
      assignmentStatus: task.assignmentStatus,
      quizstatus: task.quizstatus,
    });
  });

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Assignment/Quiz</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* One table row for each task */}
                {filteredDatesWithConvertedDates.map((task, index) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <ShowTaskStatus index={index} userData={userData} />
                    </TableCell>
                    <TableCell>{task.data}</TableCell>
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
