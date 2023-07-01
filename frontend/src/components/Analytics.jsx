import * as React from "react";
import { Grid, Card, Typography, Alert } from "@mui/material";
import { useState } from "react";
import Leaderboard from "./Leaderboard";
import Activity from "./Activity";

// Show Activity Graph when user takes the course and a warning message when user not takes course
function ShowActivity({ userDataForCourse, tasks }) {
  if (userDataForCourse.length == 0) {
    return (
      <Alert severity="error">
        You have to take the course and submit assignments/quizzes to see your
        activity
      </Alert>
    );
  }
  // Show Activity graph is user has already data in this course with all tasks of the selected course
  if (userDataForCourse.length != 0) {
    return (
      <Activity userDataForCourse={userDataForCourse} tasks={tasks}></Activity>
    );
  }
}

function Analytics(props) {
  // Get the data for logged in user for this course
  const userDataForThisCourse = props.userDataForCourse;

  // Get selected course
  const selectedCourse = props.selectedCourse;

  // Get the data for all users of this course
  const dataOfAllUsersForThisCourse = props.dataOfAllUsersForThisCourse;

  return (
    <>
      <Grid container sx={{ justifyContent: "center" }} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Your Activity</Typography>
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ justifyContent: "center" }}>
            <ShowActivity
              userDataForCourse={userDataForThisCourse}
              tasks={selectedCourse.timeline.tasks}
            />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Leaderboard</Typography>
        </Grid>
        {/* Show leaderboard of the course */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ justifyContent: "center" }}>
            <Leaderboard
              dataOfAllUsersForThisCourse={dataOfAllUsersForThisCourse}
              tasks={selectedCourse.tasks}
              user={props.user}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default Analytics;
