import * as React from "react";
import { Grid, Card, Typography } from '@mui/material';
import { useState } from 'react';

function Analytics(props) {
    const [isOwner, setIsOwner] = useState(props.isOwner);
  
      return (
          <>
          <Grid container sx={{justifyContent:'center'}} spacing={2}>
            <Grid item xs={10.25}>
              <Typography>
                Activity
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{justifyContent: 'center'}}> </Card>
            </Grid> 
            <Grid item xs={10.25}>
              <Typography>
               Leaderboard
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{justifyContent: 'center'}}> 
              </Card>
            </Grid>
          </Grid>
      
      
      
          </>
        )
  }
  
  export default Analytics;