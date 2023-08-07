import * as React from "react";
import Navbar from "./Navbar";
import GeneralView from "./GeneralView";
import Analytics from "./Analytics";
import { Tabs, Tab, Grid, Typography, Button, Card } from "@mui/material";
import { TabPanel, TabContext } from "@mui/lab";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/**
 * The function `TakeTask` is an asynchronous function that makes an API call to subscribe a user to a
 * course task and returns the response status and message.
 * @returns an object with two properties: "status" and "msg". The "status" property indicates the
 * status of the API call (200, 401, or 500), and the "msg" property contains a message associated with
 * the status.
 */
async function TakeTask(courseTimelineId, taskId, score, formData) {
  let apiCallParameters =
    formData !== null
      ? {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      : {
          method: "POST",
          body: JSON.stringify({
            timelineId: courseTimelineId,
            score: score,
          }),
          // header neccessary for correct sending of information
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        };
  // make API call to subscribe user to the course
  try {
    // send POST request to REST API
    let res = await fetch(
      `${import.meta.env.VITE_API_URL}/courseTakeTask/${taskId}`,
      apiCallParameters
    );

    // parse return statement from backend
    let resJson = await res.json();

    if (res.status === 200) {
      // alert(resJson.msg);
      return { status: 200, msg: resJson.msg };
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
 * The function `CreateAndSaveTask` makes an API call to add a task to a course timeline and returns
 * the response status and message.
 * @returns an object with two properties: "status" and "msg". The "status" property indicates the
 * status of the API call (200, 401, or 500), and the "msg" property contains a message associated with
 * the status.
 */
async function CreateAndSaveTask(courseTimelineId, formData) {
  // make API call to subscribe user to the course
  try {
    // send POST request to REST API
    let res = await fetch(
      `${import.meta.env.VITE_API_URL}/courseAddTask/${courseTimelineId}`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    // parse return statement from backend
    let resJson = await res.json();

    if (res.status === 200) {
      alert(resJson.msg);
      return { status: 200, msg: resJson.msg };
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
 * The function `CreateAndSaveMileStone` makes an API call to add a milestone to a course timeline and
 * returns the response from the backend.
 * @returns different values based on the conditions:
 */
async function CreateAndSaveMileStone(
  courseTimelieId,
  type,
  data,
  subscriberTimelines
) {
  // make API call to subscribe user to the course
  try {
    // send POST request to REST API
    let res = await fetch(
      `${import.meta.env.VITE_API_URL}/courseAddMilestone/${courseTimelieId}`,
      {
        method: "POST",
        body: JSON.stringify({
          type: type,
          data: data,
          subscriberTimelines: subscriberTimelines,
        }),
        // header neccessary for correct sending of information
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      }
    );

    // parse return statement from backend
    let resJson = await res.json();

    if (res.status === 200) {
      alert(resJson.msg);
      return resJson.msg;
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
 * The function `TakeCourse` makes an API call to subscribe a user to a course and returns a message
 * indicating the success or failure of the operation.
 * @returns a promise that resolves to the message received from the backend API. If the API call is
 * successful and the response status is 200, the function returns the message from the response JSON.
 * If the response status is 401 and the message is "Unauthorized", the function returns an object with
 * status 401 and the message "Unauthorized". If the API call is not successful or not authorized,
 */
async function TakeCourse(courseId, userId) {
  // make API call to subscribe user to the course
  try {
    // send POST request to REST API
    let res = await fetch(
      `${import.meta.env.VITE_API_URL}/takeCourse/${courseId}`,
      {
        method: "POST",
        body: JSON.stringify({
          userId: userId,
        }),
        // header neccessary for correct sending of information
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      }
    );

    // parse return statement from backend
    let resJson = await res.json();

    if (res.status === 200) {
      // alert(resJson.msg);
      return resJson.msg;
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
 * The function `GetAllCourseInfo` makes an API call to retrieve all information about a specific
 * course.
 * @returns a Promise that resolves to the response JSON object if the status code is 200. If the
 * status code is 401 and the response message is "Unauthorized", it returns an object with status 401
 * and message "Unauthorized". If the status code is not 200 or 401, it returns an object with status
 * 500 and message "Not successful and authorized".
 */
async function GetAllCourseInfo(courseId) {
  // make API call to get all courses
  try {
    // send get request to REST API
    let res = await fetch(
      `${import.meta.env.VITE_API_URL}/courseAllInfo/${courseId}`,
      {
        method: "GET",
        // header neccessary for correct sending of information
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      }
    );

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

/**
 * The function `GetAllCourseSubscriberData` makes an API call to retrieve all subscriber data for a
 * given course.
 * @returns a Promise that resolves to an object. The object contains the status and message
 * properties. The status property indicates the status of the API call (200, 401, or 500), and the
 * message property provides additional information about the status.
 */
async function GetAllCourseSubscriberData(courseId) {
  // make API call to get all subscriber data for a course
  try {
    // send get request to REST API
    let res = await fetch(
      `${import.meta.env.VITE_API_URL}/allSubscriberData/${courseId}`,
      {
        method: "GET",
        // header neccessary for correct sending of information
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      }
    );

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

/* A React component called CoursePage responsible for rendering the course page for
a specific course. */
export default function CoursePage() {
  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);
  const navigate = useNavigate();
  // Get user and selected course from route parameters
  const location = useLocation();
  const user = location.state.user;

  // Get course id from route
  let courseId = useParams().id;

  // state for tabs
  const [tabValue, setTabValue] = React.useState("one");
  // setting the initial loading state to false
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState();
  const [dataOfAllUsersForThisCourse, setDataOfAllUsersForThisCourse] =
    useState();
  const [getDataAfterPost, setGetDataAfterPost] = useState(false);
  let isOwner = false;
  let isSubscriber = false;
  let userDataForCourse;
  let subscriberTimelines = [];

  /* Two asynchronous requests using the Promise.all method. The requests are made to the functions
 GetAllCourseSubscriberData and GetAllCourseInfo, passing in the courseId as an argument. */
  useEffect(() => {
    Promise.all([
      GetAllCourseSubscriberData(courseId),
      GetAllCourseInfo(courseId),
    ])
      .then(([res1, res2]) => {
        if (
          (res1.status === 401 && res1.msg === "Unauthorized") ||
          (res2.status === 401 && res2.msg === "Unauthorized")
        ) {
          alert(res1.msg);
          setUserSession(false);
          navigate("/");
          setGetDataAfterPost(false);
        } else {
          setDataOfAllUsersForThisCourse(res1.subscribers);
          setSelectedCourse(res2);
          setLoading(false);
          setGetDataAfterPost(false);
        }
      })
      .catch((err) => {
        setError(true);
      });
  }, [getDataAfterPost]);

  /* Checks if the loading variable is false. If it is
 not loading, it performs some actions. */
  if (!loading) {
    // Check if user is owner of course
    if (user.id == selectedCourse.owner) {
      isOwner = true;
    }

    // check if user is a subscriber of course
    userDataForCourse = dataOfAllUsersForThisCourse.filter(
      (subscriber) =>
        subscriber.course == courseId && subscriber.subscriber == user.id
    );
    if (userDataForCourse.length !== 0) {
      isSubscriber = true;
    }

    dataOfAllUsersForThisCourse.forEach((subscriber) => {
      subscriberTimelines = [
        ...subscriberTimelines,
        subscriber.usertimeline.usertimeline._id,
      ];
    });
  }

  /**
   * The handleChange function updates the tab value based on the new value passed in.
   */
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  /**
   * The function `handleTakeCourse` takes a courseId and userId as parameters, calls the `TakeCourse`
   * function with those parameters, and handles the response by either displaying an alert and
   * navigating to the home page if the response is unauthorized, or setting a state variable to trigger
   * an update of information.
   */
  const handleTakeCourse = (courseId, userId) => {
    TakeCourse(courseId, userId)
      .then((res) => {
        if (res.status === 401 && res.msg === "Unauthorized") {
          alert(res.msg);
          setUserSession(false);
          navigate("/");
        } else {
          // using setGetDataAfterPost to call useEffect which will update information
          setGetDataAfterPost(true);
        }
      })
      .catch((err) => {
        setError(true);
      });
  };

  /**
   * The function handleNavigateBack navigates the user back to the home page.
   */
  const handleNavigateBack = () => {
    navigate("/home");
  };

  return (
    <>
      {/* allow backend to do its magic */}
      {/* {loading && <></>}
      {error && <></>} */}
      {dataOfAllUsersForThisCourse && selectedCourse && (
        <>
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            <Grid item xs={12}>
              <Navbar></Navbar>
            </Grid>
            <Grid item xs={10.25}>
              <Button variant="text" onClick={handleNavigateBack}>
                <ArrowBackIcon />
                Back to Homepage
              </Button>
            </Grid>
            {/* Show name of selected course */}
            <Grid item xs={5.25} sm={7.8} md={8} lg={8.7}>
              <Typography variant="h5">{selectedCourse.name}</Typography>
            </Grid>
            {/* Take Course button if user is not owner or already subscriber */}
            <Grid item xs={4.75} sm={2.2} md={2} lg={1.3}>
              {!isOwner && !isSubscriber && (
                <>
                  <Button
                    onClick={() => handleTakeCourse(courseId, user.id)}
                    variant="contained"
                  >
                    Take Course{" "}
                  </Button>
                </>
              )}
            </Grid>
            <Grid item xs={10}>
              <Card variant="outlined">
                <TabContext value={tabValue}>
                  <Tabs
                    value={tabValue}
                    onChange={handleChange}
                    centered
                    variant="fullWidth"
                  >
                    <Tab value="one" label="Assignments and Quizzes"></Tab>
                    <Tab value="two" label="Analytics"></Tab>
                  </Tabs>
                  <TabPanel value="one">
                    <GeneralView
                      selectedCourse={selectedCourse}
                      isOwner={isOwner}
                      user={user}
                      userDataForCourse={userDataForCourse}
                      subscriberTimelines={subscriberTimelines}
                      dataOfAllUsersForThisCourse={dataOfAllUsersForThisCourse}
                      createAndSaveMilestone={CreateAndSaveMileStone}
                      createAndSaveTask={CreateAndSaveTask}
                      coursePageRerenderValue={getDataAfterPost}
                      coursePageRerender={setGetDataAfterPost}
                      takeTask={TakeTask}
                    ></GeneralView>
                  </TabPanel>
                  <TabPanel value="two">
                    <Analytics
                      userDataForCourse={userDataForCourse}
                      selectedCourse={selectedCourse}
                      dataOfAllUsersForThisCourse={dataOfAllUsersForThisCourse}
                      user={user}
                    ></Analytics>
                  </TabPanel>
                </TabContext>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
