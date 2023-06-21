import React from "react";
import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import courseHubLogo from "../assets/CourseHubLogo.png";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("/home");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="inherit">
          <Toolbar>
            <Box
              component="img"
              src={courseHubLogo}
              sx={{ height: 60, cursor:'pointer' }}
              onClick={handleOnClick}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Avatar sx={{cursor:'pointer'}} />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}