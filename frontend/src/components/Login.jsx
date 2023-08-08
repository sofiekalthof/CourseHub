import React, { useState } from "react";
import { Button, TextField, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";

/**
 * The `Login` function is a React component that renders a form for user login and handles
 * form submission by making an API call to login the user.
 * @returns The function `Login` returns a JSX element that represents a form for user login.
 */
export default function Login() {
  // define states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/home");
  };

  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);

  /**
   * The handleSubmit function is used to handle form submission, validate the email format, send a POST
   * request to a REST API with the email and password, handle the response, and perform necessary
   * actions based on the response status.
   * @returns The code is returning a Promise that resolves to the response from the API.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // RegEx for checking a valid e-mail format
    let re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    // check if email is valid
    if (!re.test(email)) {
      alert("Invalid E-mail! Please enter a valid e-mail.");
      return;
    }

    try {
      // send GET request to REST API with email
      let res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        // all information being sent
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        // header neccessary for correct sending of information
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      });

      // parse return statement from backend
      let resJson = await res.json();

      if (res.status === 200) {
        // if response is successful, reset states
        setEmail("");
        setPassword("");

        // set session accodingly
        await setUserSession(resJson.userInfo);

        // route to homepage
        handleHome();
      } else if (res.status === 400) {
        // console.logs for identifying errors
        // stubs to ensure no-op , if there is no console
        if (typeof console === "undefined") {
          console = { log: function () {} };
        } else {
          console.log(resJsonLogIn.msg);
        }
      } else {
        if (typeof console === "undefined") {
          console = { log: function () {} };
        } else {
          console.log("Form returned error from backend.");
          console.log(resJson.msg);
        }
      }
    } catch (err) {
      if (typeof console === "undefined") {
        console = { log: function () {} };
      } else {
        console.log(
          "Frontend error. Post request could not be sent. Check API!"
        );
      }
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
        {/* grid for the Log-In form fields and buttons */}
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
            sx={{ mt: 3, mb: 2, color: "secondary", fontWeight: "bold" }}
          >
            Sign In
          </Button>
        </Grid>
      </Box>
    </>
  );
}
