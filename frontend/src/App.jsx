import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import CoursePage from "./components/CoursePage";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";

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

export default function App() {
  return (
    <>
      {/* using the theme defined above */}
      <ThemeProvider theme={themeDarkGreen}>
        <CssBaseline />
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/welcome" element={<Welcome />} /> */}
        </Routes>
      </ThemeProvider>
    </>
  );
}
