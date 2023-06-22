import Courses from './Courses';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import { Card, CardContent, Grid, Typography, Paper, Box, Button } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function HomePage(){
    const user = {
        id: 1,
        username: "Test",
        email: "test@user",
        password: "Test123"
    }

    return(
        <>
        <Grid container spacing={2} sx={{justifyContent:'center'}}>
            <Grid item xs={12}> 
                <Navbar/>
            </Grid>
            <Grid item xs={10}>
                <Grid container>
                    <Grid item xs={10.7}>
                        <Typography>
                            All Courses
                        </Typography>
                    </Grid>
                    <Grid item xs={1.3}>
                        <Button variant='contained'>Create New</Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={10}>
                <Courses user={user}></Courses>
            </Grid>
            
        </Grid>
        </>
    )
}
export default HomePage;