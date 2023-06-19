import LandingPage from "./components/LandingPage";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useState } from "react";
import { createContext } from "react";

// new MUI theme with the mock-up website colors
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

// global context to use for loading contexts
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
  // comp state and state-change functions
  const [comp, setComp] = useState("LandingPage");
  const toRegister = () => {
    setComp("Register");
  };
  const toLogIn = () => {
    setComp("LogIn");
  };
  const toWelcome = () => {
    setComp("Welcome");
  };
  const toLandingPage = () => {
    setComp("LandingPage");
  };
  return (
    <>
      {/* using the theme defined above */}
      <ThemeProvider theme={themeDarkGreen}>
        <CssBaseline />
        {/* allow children to use all functions and the state */}
        <CompToLoad.Provider
          value={{ comp, toWelcome, toRegister, toLogIn, toLandingPage }}
        >
          {renderSwitch(CompToLoad._currentValue)}
        </CompToLoad.Provider>
      </ThemeProvider>
    </>
  );
}
