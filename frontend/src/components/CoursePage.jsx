import * as React from "react";
import Navbar from "./Navbar";
import GeneralView from "./GeneralView";
import HomePage from "./HomePage";
import { Box, Tabs, Tab, Grid, Typography, Button, Card } from "@mui/material";
import { TabPanel, TabContext } from "@mui/lab";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { courses } from "../data/courses";

function TakeCourse({isOwner}){
  if(!isOwner){
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
  console.log(isOwner)

  //handleChange function for tabContext
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  console.log(user.id == selectedCourse[0].owner.id)


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
          <TakeCourse isOwner={isOwner}/>
        </Grid>
        <Grid item xs={10}>
        <Card variant='outlined'>
          <TabContext value={tabValue}>
            <Tabs value={tabValue} onChange={handleChange} centered variant="fullWidth">
              <Tab value="one" label="Assignments and Quizzes"></Tab>
              <Tab value="two" label="Analytics"></Tab>
            </Tabs>
            <TabPanel value="one">
              <GeneralView selectedCourse={selectedCourse[0]} isOwner={isOwner}></GeneralView>
            </TabPanel>
            <TabPanel value="two"></TabPanel>
          </TabContext>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default CoursePage;
