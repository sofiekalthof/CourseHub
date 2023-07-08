import * as React from "react";
import Timeline from "./Timeline";
import ApexTimeline from "./ApexTimeline";
import ApexTimelineScatter from "./ApexTimelineScatter";
import {
  Grid,
  Box,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  TextField,
  Checkbox,
  Typography,
  Card,
} from "@mui/material";
import AssignmentList from "./AssignmentList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import CreateTask from "./CreateTask";
import CreateMileStone from "./CreateMilestone";

function GeneralView(props) {
  const [isOwner, setIsOwner] = useState(props.isOwner);

  return (
    <>
      <Grid container sx={{ justifyContent: "center" }} spacing={2}>
        <Grid item xs={10.25}>
          <Typography variant="h6">Timeline</Typography>
        </Grid>
        {/* Button for adding a milestone */}
        <Grid item xs={1.75}>
          <CreateMileStone
            selectedCourseTimelineId={props.selectedCourse.timeline._id}
            subscriberTimelines={props.subscriberTimelines}
            createAndSaveMilestone={props.createAndSaveMilestone}
            coursePageRerender={props.coursePageRerender}
            isOwner={isOwner}
          ></CreateMileStone>
        </Grid>
        {/* Showing timeline */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ justifyContent: "center" }}>
            <ApexTimelineScatter
              tasks={props.selectedCourse.timeline.tasks}
              milestones={props.selectedCourse.timeline.milestones}
              user={props.user}
            ></ApexTimelineScatter>
          </Card>
        </Grid>
        <Grid item xs={10.25}>
          <Typography variant="h6">Assignments and Quizzes</Typography>
        </Grid>
        {/* Button for creating a new task */}
        <Grid item xs={1.75}>
          <CreateTask
            selectedCourseTimelineId={props.selectedCourse.timeline._id}
            subscriberTimelines={props.subscriberTimelines}
            createAndSaveTask={props.createAndSaveTask}
            coursePageRerender={props.coursePageRerender}
            isOwner={isOwner}
          ></CreateTask>
        </Grid>
        {/* Showing Assignmentlist */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ justifyContent: "center" }}>
            <AssignmentList
              dataOfAllUsersForThisCourse={props.dataOfAllUsersForThisCourse}
              tasks={props.selectedCourse.timeline.tasks}
              user={props.user}
              userDataForCourse={props.userDataForCourse}
              coursePageRerender={props.coursePageRerender}
              selectedCourseTimelineId={props.selectedCourse.timeline._id}
              takeTask={props.takeTask}
              isOwner={isOwner}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default GeneralView;
