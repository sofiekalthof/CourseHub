import LandingPage from "./components/LandingPage";
import RegisterLogInPage from "./components/RegisterLogInPage";
import HomePage from "./components/HomePage";
import CoursePage from "./components/CoursePage";
import React, { createContext, useState, useEffect } from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Route, Routes } from "react-router-dom";

// new MUI theme with the mock-up website colors
const themeDarkGreen = createTheme({
  palette: {
    background: {
      default: "#ffffff",
    },
    text: {
      primary: "#05386B",
      secondary: "#05386B",
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
  // flag for debugging or developing w/o user authentification
  const debug = false;
  const [userSession, setUserSession] = useState(true);

  const fetchUserAuth = async () => {
    if (debug) {
      // test user id is set to session
      setUserSession({ _id: "6496f1ae73f6e014598d9630" });
      return;
    }
    try {
      // check if user is authenticated
      const res = await fetch(`${import.meta.env.VITE_API_URL}/isAuth`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      });
      console.log("isAuth API call from App");

      // parse return statement from backend
      let resJson = await res.json();

      // 401 -> no session found, hence a redirect
      if (
        res.status === 401 &&
        window.location.pathname !== "/" &&
        window.location.pathname !== "/registerlogin"
      ) {
        // debug messages
        console.log(`${resJson.msg}. Redirecting to HomePage`);
        alert(`${resJson.msg}. Redirecting to HomePage`);
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
      <UserContext.Provider value={[userSession, setUserSession]}>
        {/* using the theme defined above */}
        <ThemeProvider theme={themeDarkGreen}>
          <CssBaseline />
          <Routes>
            {/* default route is landing page */}
            <Route path="*" element={<LandingPage />} />
            {/* if there is a user session, these routes are available */}
            {userSession.id && (
              <>
                <Route path="/home" element={<HomePage />} />
                <Route path="/course/:id" element={<CoursePage />} />
              </>
            )}
            {/* if there is no user session, these routes are available */}
            {!userSession.id && (
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
