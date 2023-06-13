// Log-In Form component
import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const API_URL = "...";

export default function Login() {
  // define states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // function to handle submitting the form
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // send post request to REST API
      let res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      // uncomment below to see returned document from backend
      // let resJson = await res.json();

      // if response is successful, reset states
      if (res.status === 200) {
        setName("");
        setEmail("");
        // debug
        console.log("Form done.");
      } else {
        console.log("Form returned error from backend.");
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
