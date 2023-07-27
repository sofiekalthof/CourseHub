import Courses from "./Courses";
import Navbar from "./Navbar";
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
import { useContext } from "react";
import { UserContext } from "../App";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * The function `CreateCourse` makes an API call to create a new course with the given name,
 * description, and owner ID, and returns the response from the API.
 * @returns different objects based on the response from the API:
 */
async function CreateCourse(courseName, courseDescription, ownerID) {
  // make API call to get all courses
  try {
    // send get request to REST API
    let res = await fetch(`${import.meta.env.VITE_API_URL}/courses/create`, {
      method: "POST",
      body: JSON.stringify({
        name: courseName,
        description: courseDescription,
        owner: ownerID,
      }),
      // header neccessary for correct sending of information
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      credentials: "include",
    });

    // parse return statement from backend
    let resJson = await res.json();

    if (res.status === 200) {
      alert(resJson.msg);
      return resJson.newCourse;
    }
    if (res.status === 401 && resJson.msg === "Unauthorized") {
      return { status: 401, msg: "Unauthorized" };
    }
    return { status: 500, msg: "Not successful and authorized" };
  } catch (err) {
    console.log("Frontend error. Get request could not be sent. Check API!");
  }
}

/**
 * The function `GetAllCourseIdDescs` makes an API call to retrieve all course IDs and descriptions,
 * and returns the response data or an error message.
 * @returns a Promise that resolves to an object. The object can have different properties depending on
 * the response from the API:
 */
async function GetAllCourseIdDescs() {
  // make API call to get all courses
  try {
    // send get request to REST API
    let res = await fetch(`${import.meta.env.VITE_API_URL}/courseIdDescs`, {
      method: "GET",
      // header neccessary for correct sending of information
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      credentials: "include",
    });

    // parse return statement from backend
    let resJson = await res.json();

    if (res.status === 200) {
      return resJson;
    }
    if (res.status === 401 && resJson.msg === "Unauthorized") {
      return { status: 401, msg: "Unauthorized" };
    }
    return { status: 500, msg: "Not successful and authorized" };
  } catch (err) {
    console.log("Frontend error. Get request could not be sent. Check API!");
  }
}

/* The above code is a React component called `HomePage`. It is responsible for rendering the homepage
of a web application. */
function HomePage() {
  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);
  const navigate = useNavigate();

  // setting the initial loading state to false
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [courseIdDescs, setCourseIdDescs] = useState();

  // useEffect first time it is rendering
  useEffect(() => {
    // get all courses
    GetAllCourseIdDescs()
      .then((res) => {
        if (res.status === 401 && res.msg === "Unauthorized") {
          alert(res.msg);
          setUserSession(false);
          navigate("/");
        } else {
          // use promise to set courses
          setCourseIdDescs(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
      });
  }, []);
  // console.log("courseIdDescs in homepage: ", courseIdDescs);

  // take user information from global context
  // TODO: remove the prop, since userSession is global OR make it all one prop
  const user = userSession;

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

  // Function for opening the Dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function for canceling te creation of a new course
  const handleClickCancel = () => {
    setOpen(false);
    setCourseName("");
    setCourseDescription("");
  };

  // Function for saving a new course
  const handleClickSave = () => {
    // create new course in db
    CreateCourse(courseName, courseDescription, userSession.id)
      .then((newCourse) => {
        if (newCourse.status === 401 && newCourse.msg === "Unauthorized") {
          alert(newCourse.msg);
          setUserSession(false);
          navigate("/");
        } else {
          // use promise to add new course to list of all courses
          setCourseIdDescs([...courseIdDescs, newCourse]);
          setLoading(false);
        }
      })
      .catch((err) => {
        navigate("/");
        setLoading(false);
        setError(true);
      });
    setOpen(false);
    setCourseName("");
    setCourseDescription("");
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
            <Grid item xs={7} sm={9.7} md={9.85} lg={10.7}>
              <Typography variant="h5">All Courses</Typography>
            </Grid>
            <Grid item xs={5} sm={2.3} md={2.15} lg={1.3}>
              <Button variant="contained" onClick={handleClickOpen}>
                Create New
              </Button>
              {/* Dialog for creating a new course */}
              <Dialog open={open}>
                <DialogContent sx={{ m: 2 }}>
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
                  <Button onClick={handleClickCancel}>Cancel</Button>
                  <Button variant="contained" onClick={handleClickSave}>
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </Grid>
        {/* Grid for showing all Course Cards and Searchbar*/}
        <Grid item xs={10}>
          {/* allow backend to do its magic */}
          {loading && <></>}
          {error && <></>}
          {courseIdDescs && (
            <>
              <Courses user={user} courseIdDescs={courseIdDescs}></Courses>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}
export default HomePage;
