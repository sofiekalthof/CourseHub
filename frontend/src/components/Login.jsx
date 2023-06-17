// Log-In Form component
import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// TODO: move url to .env
const API_URL = "http://localhost:3600";

export default function Login() {
  // define states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // function to handle submitting the form
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // send get request to REST API
      let res = await fetch(`${API_URL}/${email}`, {
        method: "GET",
        // header neccessary for correct sending of information
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      // parse return statement
      let resJson = await res.json();

      if (res.status === 200) {
        // if response is successful, reset states
        setEmail("");
        setPassword("");
        // some debug commands
        console.log("Form done.");
        alert("User is logged in.");
        console.log(resJson);
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
      {/* log-in form based-on Shoeb's material ui lecture */}
      <Grid
        container
        spacing={0}
        // self centering grid props
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 1, p: 3, bgcolor: "#ffffff" }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{ textAlign: "right", fontWeight: "bold" }}
          >
            Sign In
          </Typography>
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Grid>
    </>
  );
}
