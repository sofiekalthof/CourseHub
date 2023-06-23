import * as React from "react";
import { Grid, Card, Typography } from '@mui/material';
import { useState } from 'react';
import Leaderboard from "./Leaderboard";
import Activity from "./Activity";

function ShowActivity({userDataForCourse, tasks}){
    console.log(userDataForCourse);
    console.log(tasks)
    if(userDataForCourse.length == 0){
        return <Typography>You have to take the course to see your activity</Typography>
    } 
    if(userDataForCourse.length != 0) {
        return <Activity userDataForCourse={userDataForCourse} tasks={tasks}></Activity>
    }
}


function Analytics(props) {
    const userDataForThisCourse = props.userDataForCourse;
    const selectedCourse = props.selectedCourse;
  
      return (
          <>
          <Grid container sx={{justifyContent:'center'}} spacing={2}>
            <Grid item xs={10.25}>
              <Typography>
                Activity
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{justifyContent: 'center'}}> 
              <ShowActivity userDataForCourse={userDataForThisCourse} tasks={selectedCourse.timeline.tasks}/>
              </Card>
            </Grid> 
            <Grid item xs={10.25}>
              <Typography>
               Leaderboard
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{justifyContent: 'center'}}> 
              <Leaderboard dataOfAllUsersForThisCourse={props.dataOfAllUsersForThisCourse} tasks={props.selectedCourse.tasks}/>
              </Card>
            </Grid>
          </Grid>
      
      
      
          </>
        )
  }
  
  export default Analytics;