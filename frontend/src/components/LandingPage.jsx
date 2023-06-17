import Login from "./Login";
import Register from "./Register";
import WelcomeMessage from "./WelcomeMessage";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useContext } from "react";
import { CompToLoad } from "../App";
import { Typography } from "@mui/material";

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

  return <>{renderSwitch(compProvider.comp)}</>;
}
