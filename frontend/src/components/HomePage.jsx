import Courses from "./Courses";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { courses } from "../data/courses";

function HomePage() {
  // Dummy user that is logged in
  const user = {
    id: 0,
    username: "Test",
    email: "test@user",
    password: "Test123",
  };

  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  // Function for setting the course title
  const handleNewCourse = (e) => {
    setCourseName(e.target.value);
  };

  // Function for setting the course description
  const handleCourseDescription = (e) => {
    setCourseDescription(e.target.value);
  };

  //Function for opening the Dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  //Function for canceling te creation of a new course
  const handleClickCancel = () => {
    setOpen(false);
    setCourseName("");
    setCourseDescription("");
  };

  // Function for saving a new course
  //TODO: connection to Backend
  const handleClickSave = () => {
    courses.push({ id: 9, name: courseName, description: courseDescription });
    setOpen(false);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        {/* Grid for the NavigationBar */}
        <Grid item xs={12}>
          <Navbar />
        </Grid>
        <Grid item xs={10}>
          <Grid container>
            {/* Grid for showing the title of the page */}
            <Grid item xs={10.7}>
              <Typography variant="h5">All Courses</Typography>
            </Grid>
            <Grid item xs={1.3}>
              <Button variant="contained" onClick={handleClickOpen}>
                Create New
              </Button>
              {/* Dialog for creating a new course */}
              <Dialog open={open}>
                <DialogContent>
                    <Grid container spacing={2}>
                  <DialogContentText>Create a new course</DialogContentText>
                  <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Course name"
                    variant="outlined"
                    sx={{ flexGrow: 1 }}
                    onChange={handleNewCourse}
                    value={courseName}
                  ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Course description"
                    variant="outlined"
                    sx={{ flexGrow: 1 }}
                    onChange={handleCourseDescription}
                    value={courseDescription}
                  ></TextField>
                  </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClickSave}>Save</Button>
                  <Button onClick={handleClickCancel}>Cancel</Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </Grid>
        {/* Grid for showing all Course Cards and Searchbar*/}
        <Grid item xs={10}>
          <Courses user={user} courses={courses}></Courses>
        </Grid>
      </Grid>
    </>
  );
}
export default HomePage;
