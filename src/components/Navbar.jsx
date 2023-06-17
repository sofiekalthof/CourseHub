import React from 'react';
import { AppBar, Box, Grid, IconButton, Paper, Toolbar, Typography, Button, Avatar} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import courseHubLogo from '../assets/CourseHubLogo.png';


export default function Navbar(){
    return(
        <>
            <Box sx={{flexGrow:1}}>
                <AppBar position='inherit' color='inherit'>
                    <Toolbar>
                        <Box component="img" src={courseHubLogo} sx={{ height: 60 }} />  
                        <Box sx={{ flexGrow: 1 }} />
                        <Avatar/>

                    </Toolbar>
                
                </AppBar>
                
            </Box>
        </>
    );
}