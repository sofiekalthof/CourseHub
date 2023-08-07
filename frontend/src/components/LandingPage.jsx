import LandingPageBackground from "../assets/LandingPageBackground.png";
import { Button, Grid, Typography, Box } from "@mui/material";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";

/* The code is defining a React functional component called `LandingPage`. This component represents
the landing page of the application. */
export default function LandingPage() {
  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);
  const navigate = useNavigate();
  /**
   * The handleRegister function checks if the user is logged in and navigates to the home page if they
   * are, otherwise it navigates to the register/login page.
   */
  const handleRegister = () => {
    if (userSession.id) navigate("/home");
    else navigate("/registerlogin");
  };
  return (
    <>
      <Grid
        container
        direction="column"
        xs={12}
        sx={{
          backgroundImage: `url(${LandingPageBackground})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "100%",
          flexGrow: 1,
        }}
      >
        <Grid item xs={12}>
          <Grid container direction="row" justifyContent="flex-start">
            <Grid item xs={5.25}>
              <Grid
                container
                direction="column"
                justifyContent="space-around"
                alignItems="flex-start"
                minHeight={700}
              >
                <Grid item sx={{ paddingTop: 13, paddingLeft: 6 }}>
                  <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    Experience a new way to
                  </Typography>
                  <Typography
                    variant="h3"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {" "}
                    manage your studies
                  </Typography>
                </Grid>
                <Grid item sx={{ paddingLeft: 8 }}>
                  <Typography variant="h6">
                    Reach your study goals by tracking
                  </Typography>
                  <Typography variant="h6">
                    your progress with timelines and activity charts
                  </Typography>
                  <Typography variant="h6">
                    or create and take quizzes and assignments.
                  </Typography>
                </Grid>
                <Grid item sx={{ paddingLeft: 8 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Bring Structure to Your Learning,
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Bring Success to Your Studies!
                  </Typography>
                </Grid>
                <Grid item sx={{ paddingLeft: 8 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRegister}
                  >
                    Get started
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
