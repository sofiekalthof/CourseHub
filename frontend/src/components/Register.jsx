import React, { useState } from "react";
import { Box, Grid, TextField, Button } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

/**
 * The `Register` function is a React component that renders a form for user registration and handles
 * form submission by making an API call to register the user.
 * @returns The function `Register` returns a JSX element that represents a form for user registration.
 */
export default function Register() {
  // define states
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/home");
  };

  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);

  /**
   * The handleSubmit function is used to handle the form submission, including
   * validation of password and email fields, making an API call to register a user, and handling
   * different response statuses.
   * @returns The function `handleSubmit` does not explicitly return anything.
   */
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
      let res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        // all information being sent
        body: JSON.stringify({
          username: userName,
          email: email,
          password: password,
        }),
        // header neccessary for correct sending of information
        headers: {
          "Content-type": "application/json",
        },
      });
      // parse return statement from backend
      let resJson = await res.json();
      console.log(resJson.msg);
      if (res.status === 200) {
        // some debug commands
        console.log("Form done.");
        //alert("User added");
        try {
          console.log("email: ", email);
          console.log("password: ", password);
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
          console.log(resJson);
          if (res.status === 200) {
            // if response is successful, reset states
            setEmail("");
            setPassword("");
            // set session accodingly (note: when console.logging userSession is still "unathorized", but loading works as usual)
            await setUserSession(resJson.userInfo);
            console.log("Login form done.");
            // alert(resJson.msg);
            // route to homepage
            handleHome();
          } else if (res.status === 400) {
            // alert(resJson.msg);
            console.log(resJson.msg);
          } else {
            // some debug commands
            console.log("Form returned error from backend.");
            console.log(resJson);
            // alert(resJson.msg);
          }
        } catch (err) {
          console.log(err);
          console.log(
            "Frontend error. Post request could not be sent. Check API!"
          );
        }
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
