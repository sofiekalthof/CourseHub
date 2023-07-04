import Welcome from "./Welcome";
import LandingPageDesign from "../assets/LandingPage.png";
import { Button, Grid, Typography, Box } from "@mui/material";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";

export default function LandingPage() {
  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);
  const navigate = useNavigate();
  const handleRegister = () => {
    if (userSession.id) navigate("/home");
    else navigate("/registerlogin");
  };
  return (
    <>
      <Grid container direction="column">
        <Grid item xs={12}>
          <Grid container direction="row" justifyContent="flex-end">
            <Grid item xs={5.25}>
              <Grid
                container
                direction="column"
                justifyContent="space-around"
                alignItems="flex-start"
                height={700}
              >
                <Grid item sx={{ paddingTop: 20, paddingLeft: 8 }}>
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
            <Grid item xs={6.75}>
              <img src={LandingPageDesign} width={800} height={700}></img>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
