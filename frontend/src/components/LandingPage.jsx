import Welcome from "./Welcome";
import LandingPageHalf from "../assets/LandingPageHalf.png";
import { Button, Grid, Typography, Box } from "@mui/material";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const slogan =
    "Bring Structure to Your Learning,\nBring Success to Your Studies with CourseHub";
  const navigate = useNavigate();
  const handleRegister = () => {
    navigate("/registerlogin");
  };
  return (
    <>
      <Welcome></Welcome>

      <Grid container direction="column">
        {/*<Grid item xs={12}>
          <Navbar></Navbar>
        </Grid>
  */}
        <Grid item xs={12}>
          <Grid container direction="row" justifyContent="flex-end">
            <Grid item xs={5.5}>
              <Grid
                container
                direction="column"
                justifyContent="space-around"
                alignItems="flex-start"
                height={700}
              >
                <Grid item sx={{ paddingTop: 20, paddingLeft: 10 }}>
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
                <Grid item sx={{ paddingLeft: 10 }}>
                  <Typography variant="h6">
                    Reach your study goals by tracking 
                  </Typography>
                  <Typography variant="h6">
                    your progress with
                    timelines and activity charts
                  </Typography>
                  <Typography variant="h6">
                    or create and take quizzes and assignments.
                  </Typography>
                </Grid>
                <Grid item sx={{ paddingLeft: 10 }}>
                  <Typography variant="h6">
                    Bring Structure to Your Learning,
                  </Typography>
                  <Typography variant="h6">
                     Bring Success to Your
                    Studies!
                  </Typography>
                </Grid>
                <Grid item sx={{ paddingLeft: 10 }}>
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
            <Grid item xs={6.5}>
              <img src={LandingPageHalf} width={800} height={700}></img>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
