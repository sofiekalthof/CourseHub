import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import WelcomeMessage from "./WelcomeMessage";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { CompToLoad } from "../App";

// function to return component to load
function renderSwitch(str) {
  switch (str) {
    case "WelcomeMessage":
      return <WelcomeMessage></WelcomeMessage>;
    case "Register":
      return <Register></Register>;
    case "LogIn":
      return <Login></Login>;
    default:
      return <WelcomeMessage></WelcomeMessage>;
  }
}

export default function LandingPage() {
  const compProvider = useContext(CompToLoad);

  return (
    <>
      {/* <Button
        onClick={() => setToDisplay("Register")}
        fullWidth
        variant="contained"
      >
        Register
      </Button>
      <Button
        onClick={() => setToDisplay("Sign-In")}
        fullWidth
        variant="contained"
      >
        Log-In
      </Button>

      {toDisplay === "Register" ? <Register /> : <Login />} */}
      {/* <WelcomeMessage></WelcomeMessage> */}
      {renderSwitch(compProvider.comp)}
    </>
  );
}
