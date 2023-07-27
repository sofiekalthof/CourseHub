import * as React from "react";
import { Grid, Card, Typography, Alert } from "@mui/material";
import { useState } from "react";
import Leaderboard from "./Leaderboard";
import Activity from "./Activity";

/**
 * The ShowActivity function checks if the user has data for a course and displays an error message if
 * not, otherwise it displays the user's activity graph.
 * @returns either an error message or an Activity component.
 */
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

/**
 * The Analytics component displays the user's activity and a leaderboard for a selected course.
 * @returns The Analytics component is returning a JSX fragment that contains a Grid container with
 * multiple Grid items. Each Grid item contains different components such as Typography, Card,
 * ShowActivity, and Leaderboard.
 */
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
