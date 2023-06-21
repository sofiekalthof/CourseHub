// Welcome Page
import React from "react";
import { Button, Grid, Typography, Box } from "@mui/material";
import CourseHubLogo from "../assets/CourseHubLogo.png";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  // states/variables
  const slogan =
    "Bring Structure to Your Learning,\nBring Success to Your Studies";
  const navigate = useNavigate();
  const handleRegister = () => {
    navigate("/registerlogin");
  };
  // styling
  return (
    <>
      {/* grid to align logo, slogan and next button */}
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh", backgroundColor: "#5CDB95" }}
      >
        <Grid item xs={12} sx={{ mb: 5 }}>
          <img src={CourseHubLogo} width="300vw" height="300vh" />
        </Grid>
        <Grid item xs={12} sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              whiteSpace: "pre-line",
            }}
          >
            {slogan}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRegister}
          >
            Get started
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
