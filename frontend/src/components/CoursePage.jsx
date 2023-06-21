import * as React from "react";
import Navbar from "./Navbar";
import GeneralView from "./GeneralView";
import HomePage from "./HomePage";
import { Box, Tabs, Tab, Grid, Typography, Button, Card } from "@mui/material";
import { TabPanel, TabContext } from "@mui/lab";
import { useParams } from "react-router-dom";
import { courses } from "../data/courses";

function CoursePage() {
  const [value, setValue] = React.useState("one");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let {id} = useParams();
  console.log(id);

  let selectedCourse = courses.filter((course) => course.id == id
  )
  console.log(selectedCourse[0].id);


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
          <Button variant="contained">Take Course </Button>
        </Grid>
        <Grid item xs={10}>
        <Card variant='outlined'>
          <TabContext value={value}>
            <Tabs value={value} onChange={handleChange} centered variant="fullWidth">
              <Tab value="one" label="Assignments and Quizzes"></Tab>
              <Tab value="two" label="Analytics"></Tab>
            </Tabs>
            <TabPanel value="one">
              <GeneralView selectedCourse={selectedCourse[0]}></GeneralView>
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
