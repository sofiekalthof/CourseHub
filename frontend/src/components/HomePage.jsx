import Courses from './Courses';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import { Card, CardContent, Grid, Typography, Paper, Box, Button } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function HomePage(){

    return(
        <>
        <Grid container spacing={2} sx={{justifyContent:'center'}}>
            <Grid item xs={12}> 
                <Navbar/>
            </Grid>
            <Grid item xs={10}>
                <Grid container>
                    <Grid item xs={10.5}>
                        <Typography>
                            My Courses
                        </Typography>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Button variant='outlined'>Create New</Button>
                    </Grid>
                </Grid>
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