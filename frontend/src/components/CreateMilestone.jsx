import * as React from "react";
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
  FormLabel,
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
import { useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

// Function for Showing the Add Milestone button
function CreateMileStone(props) {
  const navigate = useNavigate();
  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [milestoneType, setMilestoneType] = useState("");
  const [date, setDate] = useState(dayjs());

  // Function for opening the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function for canceling the milestone creation
  const handleClickCancel = () => {
    setOpen(false);
    setMilestoneType("");
    setDate(dayjs());
  };

  // Function for saving the milestone
  const handleClickSave = () => {
    props
      .createAndSaveMilestone(
        props.selectedCourseTimelineId,
        milestoneType,
        date,
        props.subscriberTimelines
      )
      .then((res) => {
        console.log(res);
        if (res.status === 401 && res.msg === "Unauthorized") {
          alert(res.msg);
          setUserSession(false);
          navigate("/");
        } else {
          console.log("I landed here");
          props.coursePageRerender(!props.coursePageRerenderValue);
          setOpen(false);
        }
        setMilestoneType("");
        setDate(dayjs());
      })
      .catch((err) => {
        console.log("C");
        console.log(err);
        //alert(err);
      });
  };

  // Function for selecting milestone type
  const handleChange = (event) => {
    setMilestoneType(event.target.value);
  };

  // Show MileStone Button only when user is owner of course
  if (props.isOwner) {
    return (
      <>
        <Button variant="outlined" onClick={handleClickOpen}>
          Add Milestone
        </Button>
        {/* Dialog for adding a new Milestone */}
        <Dialog open={open} fullWidth>
          <DialogTitle>Add a milestone</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Dropdown Menu for selecting the Milestone Type */}
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ marginTop: 1 }}>
                  <InputLabel>Milestone Type</InputLabel>
                  <Select
                    value={milestoneType}
                    label="Milestone Type"
                    onChange={handleChange}
                  >
                    <MenuItem value={"Lecture"}>Lecture</MenuItem>
                    <MenuItem value={"Exam"}>Exam</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* DatePicker for Selecting Milestone Date */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={date}
                      label="Milestone Date"
                      onChange={(date) => setDate(date)}
                    ></DatePicker>
                  </LocalizationProvider>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClickCancel}>Cancel</Button>
            <Button variant="contained" onClick={handleClickSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default CreateMileStone;
