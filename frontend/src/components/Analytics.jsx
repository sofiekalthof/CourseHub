import * as React from "react";
import { Grid, Card, Typography } from '@mui/material';
import { useState } from 'react';
import Leaderboard from "./Leaderboard";

function ShowActivity({userDataForCourse}){
    console.log(userDataForCourse)
    if(userDataForCourse.length == 0){
        return <Typography>You have to take the course to see your activity</Typography>
    }
}


function Analytics(props) {
    const userDataForThisCourse = props.userDataForCourse;
  
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
              <ShowActivity userDataForCourse={userDataForThisCourse}/>
              </Card>
            </Grid> 
            <Grid item xs={10.25}>
              <Typography>
               Leaderboard
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{justifyContent: 'center'}}> 
              <Leaderboard dataOfAllUsersForThisCourse={props.dataOfAllUsersForThisCourse}/>
              </Card>
            </Grid>
          </Grid>
      
      
      
          </>
        )
  }
  
  export default Analytics;