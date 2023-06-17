import Courses from './Courses';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import { Card, CardContent, Grid, Typography, Paper, Box } from "@mui/material";

function HomePage(){

    return(
        <>
        <Grid container spacing={2} sx={{justifyContent:'center'}}>
            <Grid container item xs={12}> 
                <Navbar/>
            </Grid>
            <Grid item xs={10}>
                <Typography>
                    My Courses
                </Typography>
            </Grid>
            <Grid item xs={10}> 
                <SearchBar/>
            </Grid>
            <Grid item xs={10}>
                <Courses></Courses>
            </Grid>
            
        </Grid>
        </>
    )
}
export default HomePage;