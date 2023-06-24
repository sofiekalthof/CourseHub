// Register Form component
import React, { useState } from "react";
import { Box, Tabs, Tab, Grid, TextField, Button } from "@mui/material";

const API_URL = "http://localhost:3600";

export default function Register() {
  // define states
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // function to handle submitting the form
  const handleSubmit = async (event) => {
    event.preventDefault();

    // check if repeated password is same with normal password
    if (password !== event.target.repeatpassword.value) {
      alert("Passwords don't match! API call will not be made.");
      return;
    }
    // RegEx for checking a valid e-mail format
    let re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    // check if email is valid
    if (!re.test(email)) {
      alert("Invalid E-mail! Please enter a valid e-mail.");
      return;
    }

    // make API call
    try {
      // send post request to REST API
      let res = await fetch(`${API_URL}/register`, {
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
      } else if (res.status === 400) {
        alert(resJson.msg);
      } else {
        // some debug commands
        console.log("Form returned error from backend.");
        console.log(resJson);
      }
    } catch (err) {
      console.log("Frontend error. Post request could not be sent. Check API!");
    }
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ bgcolor: "#ffffff", minWidth: "40vw" }}
      >
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
            sx={{ mt: 3, mb: 1, color: "secondary", fontWeight: "bold" }}
          >
            Register
          </Button>
        </Grid>
      </Box>
    </>
  );
}
