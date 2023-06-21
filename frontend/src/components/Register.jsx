// Register Form component
import React, { useState } from "react";
import CourseHubLogo from "../assets/CourseHubLogo.png";
import Login from "./Login";
import { Box, Tabs, Tab, Grid, TextField, Button } from "@mui/material";
import { TabPanel, TabContext } from "@mui/lab";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3600";

export default function Register() {
  // define states
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // state related to using Tabs
  const [value, setValue] = useState("Register");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();
  const handleLogIn = () => {
    navigate("/login");
  };
  // function to handle submitting the form
  const handleSubmit = async (event) => {
    event.preventDefault();

    // check if repear password is same with normal password
    if (password !== event.target.repeatpassword.value) {
      alert("Passwords don't match! API call will not be made.");
    } else {
      // make API call
      try {
        // send post request to REST API
        let res = await fetch(API_URL, {
          method: "POST",
          // all information being sent
          body: JSON.stringify({
            username: userName,
            email: email,
            password: password,
          }),
          // header neccessary for correct sending of information
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        // parse return statement from backend
        let resJson = await res.json();

        if (res.status === 200) {
          // if response is successful, reset states
          setUserName("");
          setEmail("");
          setPassword("");
          // some debug commands
          console.log("Form done.");
          alert("User added");
          // navigate to Log-In component
          handleLogIn();
        } else {
          // some debug commands
          console.log("Form returned error from backend.");
          console.log(resJson);
        }
      } catch (err) {
        console.log(
          "Frontend error. Post request could not be sent. Check API!"
        );
      }
    }
  };

  return (
    <>
      {/* initial grid to align logo and form */}
      <Grid
        container
        spacing={0}
        // self centering grid props
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh", backgroundColor: "#5CDB95" }}
      >
        {/* logo */}
        <Grid item xs={12}>
          <img src={CourseHubLogo} width="200vw" height="200vh" />
        </Grid>
        {/* register form */}
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 1, p: 2, bgcolor: "#ffffff", minWidth: "40vw" }}
        >
          {/* grid for navigation to Register and LogIn component */}
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "5vh" }}
          >
            {/* currently using Tabs causes issues with the component loading */}
            {/* <TabContext value={value}>
              <Tabs value={value} onChange={handleChange} centered>
                <Tab value="Register" label="Register"></Tab>
                <Tab value="SignIn" label="Sign-In"></Tab>
              </Tabs>
              <TabPanel value="Register">
                <Register></Register>
              </TabPanel>
              <TabPanel value="SignIn">
                <Login></Login>
              </TabPanel>
            </TabContext> */}
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="primaryLight"
                disableElevation
                sx={{
                  fontWeight: "bold",
                  color: "primary",
                  // disable default button features of MUI
                  borderRadius: 0,
                  border: "1px solid",
                  "& .MuiButton-startIcon": { margin: 0 },
                }}
              >
                Register
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  fontWeight: "bold",
                  color: "primary",
                  borderRadius: 0,
                  border: "1px solid",
                  "& .MuiButton-startIcon": { margin: 0 },
                }}
                onClick={handleLogIn}
              >
                Sign In
              </Button>
            </Grid>
          </Grid>
          {/* grid for the Register form fields and buttons */}
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "10vh" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="repeatpassword"
              label="Repeat Password"
              type="password"
              id="repeatpassword"
              autoComplete="repeat-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, color: "secondary", fontWeight: "bold" }}
            >
              Register
            </Button>
          </Grid>
        </Box>
      </Grid>
    </>
  );
}
