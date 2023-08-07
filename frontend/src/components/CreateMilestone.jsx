import * as React from "react";
import {
  Grid,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

/**
 * The `CreateMileStone` function is a React component that renders a button to add a milestone, and a
 * dialog to input the milestone type and date, and save it.
 * @returns JSX elements, specifically a Button component and a Dialog component.
 */
export default function CreateMileStone(props) {
  const navigate = useNavigate();
  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [milestoneType, setMilestoneType] = useState("");
  const [date, setDate] = useState(dayjs());

/**
 * The `handleClickOpen` function sets the `open` state to true.
 */
  const handleClickOpen = () => {
    setOpen(true);
  };

/**
 * The `handleClickCancel` function sets the open state to false, clears the milestoneType state, and
 * sets the date state to the current day.
 */
  const handleClickCancel = () => {
    setOpen(false);
    setMilestoneType("");
    setDate(dayjs());
  };

/**
 * The `handleClickSave` function is used to create and save a milestone, and then perform some actions
 * based on the response.
 */
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

/**
 * The handleChange function updates the milestoneType state based on the value of the event target.
 */
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

