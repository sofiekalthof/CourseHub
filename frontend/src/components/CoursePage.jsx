import * as React from "react";
import Navbar from "./Navbar";
import GeneralView from "./GeneralView";
import HomePage from "./HomePage";
import { Box, Tabs, Tab, Grid, Typography, Button, Card } from "@mui/material";
import { TabPanel, TabContext } from "@mui/lab";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { courses } from "../data/courses";
import { courseUser } from "../data/coursesMongoose";
import { useState } from 'react';
import Analytics from "./Analytics";

function TakeCourse({isOwner, isSubscriber}){
  console.log(isSubscriber)
  if(!isOwner && !isSubscriber){
    return <Button variant="contained">Take Course </Button>
  }
}

function CoursePage() {
  const [tabValue, setTabValue] = React.useState("one");

  // get user from route parameters
  const location = useLocation();
  const user = location.state.user;

  // get id from route
  let {id} = useParams();

  // Get selected course
  let selectedCourse = courses.filter((course) => course.id == id);

  const [isOwner, setIsOwner] = React.useState(user.id == selectedCourse[0].owner.id ? true : false);

    // Check if user is subscriber of course
    const userDataForCourse = courseUser.filter((userData) => userData.course.id == id && userData.subscriber.id == user.id);
    let subscriber = false;
    if(userDataForCourse.length != 0){
      subscriber = true;
    }

    const dataOfAllUsersForThisCourse = courseUser.filter((userData) => userData.course.id == id);
    console.log(dataOfAllUsersForThisCourse);


  const [isSubscriber, setIsSubscriber] = React.useState(subscriber);

  //handleChange function for tabContext
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };



  return (
    <>
      <Grid container spacing={2} sx={{ justifyContent: "center"}}>
        <Grid item xs={12}>
          <Navbar></Navbar>
        </Grid>
        <Grid item xs={8.75}>
          <Typography>{selectedCourse[0].name}</Typography>
        </Grid>
        <Grid item xs={1.5}>
          <TakeCourse isOwner={isOwner} isSubscriber={isSubscriber}/>
        </Grid>
        <Grid item xs={10}>
        <Card variant='outlined'>
          <TabContext value={tabValue}>
            <Tabs value={tabValue} onChange={handleChange} centered variant="fullWidth">
              <Tab value="one" label="Assignments and Quizzes"></Tab>
              <Tab value="two" label="Analytics"></Tab>
            </Tabs>
            <TabPanel value="one">
              <GeneralView selectedCourse={selectedCourse[0]} isOwner={isOwner} user={user} userDataForCourse={userDataForCourse}></GeneralView>
            </TabPanel>
            <TabPanel value="two"><Analytics userDataForCourse={userDataForCourse} selectedCourse={selectedCourse[0]} dataOfAllUsersForThisCourse={dataOfAllUsersForThisCourse}></Analytics></TabPanel>
          </TabContext>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default CoursePage;
