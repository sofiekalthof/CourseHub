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
  Menu,
  Tooltip,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import courseHubLogo from "../assets/CourseHubLogo.png";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";

// TODO: move url to .env
const API_URL = "http://localhost:3600";

export default function Navbar() {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("/home");
  };

  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);

  // anchor for checking if icon button pressed or not
  // is either a function or HTML element
  const [anchorEl, setAnchorEl] = React.useState(null);
  // corresponding open boolean value
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = async () => {
    // reset anchor
    setAnchorEl(null);

    // destroy the session in backend
    const res = await fetch(`${API_URL}/logout`);

    // parse return statement from backend
    let resJson = await res.json();

    if (res.status === 200) {
      // reset user session in frontend
      setUserSession(false);
      alert(resJson.msg);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="inherit">
          <Toolbar>
            <Box
              component="img"
              src={courseHubLogo}
              sx={{ height: 60, cursor: "pointer" }}
              onClick={handleOnClick}
            />
            <Box sx={{ flexGrow: 1 }} />

            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              // ARIA - Accessible Rich Internet Applications -> used mostly for interactive pop-up elements
              aria-controls={open ? "basic-menu" : undefined} // element whose content are controlled by icon button
              aria-haspopup="true" // indicates popup is a menu
              aria-expanded={open ? "true" : undefined} // check if element is expanded or collapsed
            >
              <Avatar sx={{ cursor: "pointer" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Log out</MenuItem>
      </Menu>
    </>
  );
}
