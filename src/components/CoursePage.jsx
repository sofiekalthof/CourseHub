import * as React from 'react';
import Navbar from './Navbar'
import GeneralView from './GeneralView';
import HomePage from './HomePage'
import { Box, Tabs, Tab, Grid, Typography } from '@mui/material';
import { TabPanel, TabContext } from "@mui/lab";



function CoursePage() {
  const [value, setValue] = React.useState("one");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }




  return (
    <>
    <Navbar></Navbar>
    <Typography>
      Course name
    </Typography>
    <Grid container sx={{justifyContent:'center'}}>
        <Grid item>
          <TabContext value={value} >
            <Tabs value={value} onChange={handleChange} centered>
                <Tab value='one' label='Assignments and Quizzes'>
                </Tab>
                <Tab value='two' label='Analytics'>
                </Tab>
            </Tabs>
            <TabPanel value="one">
                <GeneralView></GeneralView>
            </TabPanel>
            <TabPanel value="two">
              
            </TabPanel>
          </TabContext>
        </Grid>
    </Grid> 



    </>
  )
}

export default CoursePage;