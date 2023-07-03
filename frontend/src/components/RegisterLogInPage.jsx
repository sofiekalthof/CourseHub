import React, { useState } from "react";
import CourseHubLogo from "../assets/CourseHubLogo.png";
import Login from "./Login";
import Register from "./Register";
import { Box, Tabs, Tab, Grid, TextField, Button } from "@mui/material";
import { TabPanel, TabContext } from "@mui/lab";

export default function RegisterLogInPage() {
  // state related to using Tabs
  const [value, setValue] = useState("SignIn");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {/* grid to set background color for the entire page and a some padding*/}
      <Grid sx={{ p: 4, minHeight: "100vh", backgroundColor: "#5CDB95" }}>
        {/* grid to align logo and form */}
        <Grid
          container
          spacing={0}
          // self centering grid props
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ backgroundColor: "#5CDB95" }}
        >
          {/* logo */}
          <Grid item xs={12}>
            <img src={CourseHubLogo} width="200vw" height="200vh" />
          </Grid>
          {/* register form */}
          <Box sx={{ bgcolor: "#ffffff", minWidth: "40vw" }}>
            {/* grid for navigation to Register and LogIn component */}
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ minHeight: "5vh" }}
            >
              <TabContext value={value}>
                <Tabs value={value} onChange={handleChange} centered>
                  <Tab value="SignIn" label="Sign-In"></Tab>
                  <Tab value="Register" label="Register"></Tab>
                </Tabs>
                <TabPanel value="SignIn" sx={{ p: 0, m: 2, mr: 4, ml: 4 }}>
                  <Login></Login>
                </TabPanel>
                <TabPanel value="Register" sx={{ p: 0, m: 2, mr: 4, ml: 4 }}>
                  <Register></Register>
                </TabPanel>
              </TabContext>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
