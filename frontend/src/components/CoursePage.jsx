import * as React from "react";
import Navbar from "./Navbar";
import GeneralView from "./GeneralView";
import HomePage from "./HomePage";
import { Tabs, Tab, Grid, Typography, Button, Card } from "@mui/material";
import { TabPanel, TabContext } from "@mui/lab";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
// import { courseUser } from "../data/coursesMongoose";
import { useState } from "react";
import Analytics from "./Analytics";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Function to
async function TakeTask(courseTimelineId, taskId, score, formData) {
  console.log("TakeTask in coursePage called: ");
  // console.log("courseTimelineId: ", courseTimelineId);
  // console.log("taskId: ", taskId);
  // console.log("score: ", score);
  // if formData -> takeAssignment (with uploaded file)
  // else -> takeQuiz (with normal data)
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
  console.log("apiCallParameters: ", apiCallParameters);
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

// Function to take a course
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

// Function to save a milestone in DB
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

// Function to take a course
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

// Function to get all course info
async function GetAllCourseInfo(courseId) {
  // console.log("function GetAllCourseInfo called in CoursePage");
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
      // console.log("resJson in GetAllCourseInfo: ", resJson);
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

// Function to get all subscriber data from backend for the course
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

    // console.log("resJson: ", resJson);

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

// // Show Button for taking course only when user is not owner and not already taking course
// function ShowTakeCourse({ isOwner, isSubscriber }) {
//   if (!isOwner && !isSubscriber) {
//     return <Button variant="contained">Take Course </Button>;
//   }
// }

function CoursePage() {
  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);
  // console.log("rendered coursepage");
  const navigate = useNavigate();
  // Get user and selected course from route parameters
  const location = useLocation();
  const user = location.state.user;
  // const selectedCourseId = location.state.courseId;

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

  useEffect(() => {
    // // get all subscribers of the course
    // GetAllCourseSubscriberData(courseId)
    //   .then((res) => {
    //     // use promise to set subscriber data
    //     setDataOfAllUsersForThisCourse(res.subscribers);
    //   })
    //   .catch((err) => {
    //     setError(true);
    //   });

    // // get all course data
    // GetAllCourseInfo(courseId)
    //   .then((res) => {
    //     // use promise to set selected course data
    //     setSelectedCourse(res);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setError(true);
    //   });
    console.log("re-rendering?");
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
          console.log("getting new data");
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

  console.log("all course data in coursepage: ", selectedCourse);
  // console.log("all sub data in coursepage: ", dataOfAllUsersForThisCourse);
  // console.log("userDataForCourse in CoursePage: ", userDataForCourse);
  // console.log("courseId: ", courseId);
  // console.log("first: ", dataOfAllUsersForThisCourse[0].course);
  // console.log("userId: ", user.id);
  // console.log("loading: ", loading);
  // console.log("isSubscriber: ", isSubscriber);

  // HandleChange function for tabContext
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
            <Grid item xs={10.5}>
              <Button variant="text" onClick={handleNavigateBack}><ArrowBackIcon/>Back to Homepage</Button>
            </Grid>
            {/* Show name of selected course */}
            <Grid item xs={8.75}>
              <Typography variant="h5">{selectedCourse.name}</Typography>
            </Grid>
            {/* Take Cozrse button if user is not owner or already subscriber */}
            <Grid item xs={1.5}>
              {/* <ShowTakeCourse isOwner={isOwner} isSubscriber={isSubscriber} /> */}
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

export default CoursePage;
