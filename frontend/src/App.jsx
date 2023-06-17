import LandingPage from "./components/LandingPage";
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useState } from "react";
import { createContext } from "react";

const themeDarkGreen = createTheme({
  palette: {
    background: {
      default: "#5CDB95",
      // default: "#ffffff",
    },
    text: {
      primary: "#05386B",
      secondary: "05386B",
    },
    primary: {
      main: "#5CDB95",
    },
    primaryLight: {
      main: "#8EE4AF",
    },
    secondary: {
      main: "#05386B",
    },
    secondaryLight: {
      main: "#379683",
    },
  },
});

export const CompToLoad = createContext("LandingPage");

// function to return component to load
function renderSwitch(str) {
  switch (str) {
    case "LandingPage":
      return <LandingPage></LandingPage>;
    default:
      return <LandingPage></LandingPage>;
  }
}

export default function App() {
  const [comp, setComp] = useState("LandingPage");
  const toRegister = () => {
    setComp("Register");
  };
  const toLogIn = () => {
    setComp("LogIn");
  };
  const toWelcomeMessage = () => {
    setComp("WelcomeMessage");
  };
  const toLandingPage = () => {
    setComp("LandingPage");
  };
  return (
    <>
      <ThemeProvider theme={themeDarkGreen}>
        <CssBaseline />
        <CompToLoad.Provider
          value={{ comp, toWelcomeMessage, toRegister, toLogIn, toLandingPage }}
        >
          {renderSwitch(CompToLoad._currentValue)}
        </CompToLoad.Provider>
      </ThemeProvider>
    </>
  );
}
