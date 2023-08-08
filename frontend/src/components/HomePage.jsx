import Courses from "./Courses";
import Navbar from "./Navbar";
import {
  TextField,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../App";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * The function `CreateCourse` makes an API call to create a new course with the given name,
 * description, and owner ID, and returns the response from the API.
 * @returns an object with two properties: "status" and "msg". The "status" property indicates the
 * status of the API call (200, 401, or 500), and the "msg" property contains a message associated with
 * the status. The status 200 indicates successful API call, 401 indicates unauthorized acces and logs
 * user off, and status 500 indicates any other error and logs the error.
 */
async function CreateCourse(courseName, courseDescription, ownerId) {
  // make API call to get all courses
  try {
    // send get request to REST API
    let res = await fetch(`${import.meta.env.VITE_API_URL}/courses/create`, {
      method: "POST",
      body: JSON.stringify({
        name: courseName,
        description: courseDescription,
        owner: ownerId,
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
    if (typeof console === "undefined") {
      console = { log: function () {} };
    } else {
      console.log("Frontend error. Get request could not be sent. Check API!");
    }
  }
}

/**
 * The function `GetAllCourseIdDescs` makes an API call to retrieve all course IDs and descriptions,
 * and returns the response data or an error message.
 * @returns a Promise that resolves to an object. The object has two properties: "status" and "msg".
 * The "status" property indicates the status of the API call (200, 401, or 500), and the "msg" property
 * contains a message associated with the status. The status 200 indicates successful API call, 401
 * indicates unauthorized acces and logs user off, and status 500 indicates any other error and logs
 * the error.
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
    if (typeof console === "undefined") {
      console = { log: function () {} };
    } else {
      console.log("Frontend error. Get request could not be sent. Check API!");
    }
  }
}

/* The React component called `HomePage` is responsible for rendering the homepage
of the web application. */
export default function HomePage() {
  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);
  const navigate = useNavigate();

  // setting the initial loading state to false
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [courseIdDescs, setCourseIdDescs] = useState();

  /* The `useEffect` hook is used to perform side effects in a React component. In this case, it is used
 to fetch all course IDs and descriptions from the API and update the state variables
 `courseIdDescs`, `loading`, and `error` accordingly. */
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

  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  /**
   * The `handleNewCourse` function updates the `courseName` state variable with the value of the target
   * element.
   */
  const handleNewCourse = (e) => {
    setCourseName(e.target.value);
  };

  /**
   * The function `handleCourseDescription` updates the state variable `courseDescription` with the value
   * of the target element.
   */
  const handleCourseDescription = (e) => {
    setCourseDescription(e.target.value);
  };

  /**
   * The `handleClickOpen` function sets the `open` state to true.
   */
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function for canceling te creation of a new course
  /**
   * The `handleClickCancel` function sets the `open` state to false and clears the course name and
   * description.
   */
  const handleClickCancel = () => {
    setOpen(false);
    setCourseName("");
    setCourseDescription("");
  };

  /**
   * The `handleClickSave` function creates a new course in the database, updates the list of all courses,
   * and resets the input fields and state variables.
   */
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
              <Courses
                user={userSession}
                courseIdDescs={courseIdDescs}
              ></Courses>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}
