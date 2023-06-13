// Register Form component
import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const API_URL = "...";

export default function Register() {
  // define states
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // function to handle submitting the form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== event.target.repeatpassword.value) {
      alert("Passwords don't match! API call will not be made.");
    } else {
      // make API call
      try {
        // send post request to REST API
        let res = await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify({
            userName: userName,
            email: email,
            password: password,
          }),
        });
        // uncomment below to see returned document from backend
        // let resJson = await res.json();

        // if response is successful, reset states
        if (res.status === 200) {
          setUserName("");
          setEmail("");
          setPassword("");
          // debug
          console.log("Form done.");
        } else {
          console.log("Form returned error from backend.");
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
      {/* register form based-on Shoeb's material ui lecture */}
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
            sx={{ textAlign: "left", fontWeight: "bold" }}
          >
            Register
          </Typography>
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
            type="repeatpassword"
            id="repeatpassword"
            autoComplete="repeat-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Grid>
    </>
  );
}
