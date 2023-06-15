import * as React from 'react';
import Navbar from './Navbar'
import GeneralView from './GeneralView';
import { Box, Tabs, Tab, Grid } from '@mui/material';
import { TabPanel, TabContext } from "@mui/lab";



function CoursePage() {
  const [value, setValue] = React.useState("one");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }




  return (
    <>
    <Navbar></Navbar>
    <Grid container sx={{justifyContent:'center'}}>
        <Grid item sx={{justifyContent:'center'}}>
          <TabContext value={value} sx={{justifyContent:'center'}}>
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
              test
            </TabPanel>
          </TabContext>
        </Grid>
    </Grid> 



    </>
  )
}

export default CoursePage;