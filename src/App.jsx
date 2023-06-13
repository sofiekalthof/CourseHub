import LandingPage from "./components/LandingPage";
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useState } from "react";

const themeDarkGreen = createTheme({
  palette: {
    background: {
      default: "#42f590",
      // default: "#ffffff",
    },
    text: {
      primary: "#303f9f",
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={themeDarkGreen}>
        <CssBaseline />
      </ThemeProvider>
      <LandingPage />
    </>
  );
}

export default App;
