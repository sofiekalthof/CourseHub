import React from "react";
import { Button, Grid, Typography, Box } from "@mui/material";
import CourseHubLogo from "../assets/CourseHubLogo.png";
import { useContext } from "react";
import { CompToLoad } from "../App";

export default function WelcomeMessage() {
  // states/variables
  const slogan =
    "Bring Structure to Your Learning,\nBring Success to Your Studies";
  const compProvider = useContext(CompToLoad);

  // styling
  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
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
            onClick={compProvider.toRegister}
          >
            Get Started
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
