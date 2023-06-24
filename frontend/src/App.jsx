import LandingPage from "./components/LandingPage";
import RegisterLogInPage from "./components/RegisterLogInPage";
import HomePage from "./components/HomePage";
import CoursePage from "./components/CoursePage";
import React, { createContext, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";
// TODO: move url to .env
const API_URL = "http://localhost:3600";

// new MUI theme with the mock-up website colors
const themeDarkGreen = createTheme({
  palette: {
    background: {
      default: "#ffffff",
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

// create global context to share user cookie with all child components
export const UserContext = createContext({});

export default function App() {
  const [userSession, setUserSession] = useState(true);

  const fetchUserAuth = async () => {
    try {
      // check if user is authenticated
      const res = await fetch(`${API_URL}/isAuth`);

      // parse return statement from backend
      let resJson = await res.json();

      // 401 -> no session found, hence a redirect
      if (res.status === 401) {
        // debug messages
        console.log(`${resJson.msg}. Redirecting to HomePage`);
        alert(`${resJson.msg}. Redirecting to HomePage`);
        return;
      }
      // set state with user/cookie data
      setUserSession(resJson);
    } catch (error) {
      console.error("There was an error fetch auth", error);
      return;
    }
  };

  // at first render call User Auth
  useEffect(() => {
    fetchUserAuth();
  }, []);

  return (
    <>
      {/* using user context */}
      <UserContext.Provider value={userSession}>
        {/* using the theme defined above */}
        <ThemeProvider theme={themeDarkGreen}>
          <CssBaseline />
          <Routes>
            {/* default route is landing page */}
            <Route path="*" element={<LandingPage />} />
            {/* if there is a user session, these routes are available */}
            {userSession._id && (
              <>
                <Route path="/home" element={<HomePage />} />
                <Route path="/course/:id" element={<CoursePage />} />
              </>
            )}
            {/* if there is no user session, these routes are available */}
            {!userSession._id && (
              <>
                <Route path="/" element={<LandingPage />} />
                <Route path="/registerlogin" element={<RegisterLogInPage />} />
              </>
            )}
          </Routes>
        </ThemeProvider>
      </UserContext.Provider>
    </>
  );
}
