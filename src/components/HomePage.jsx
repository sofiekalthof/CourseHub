import Navbar from './Navbar';
import SearchBar from './SearchBar';
import { Card, CardContent, Grid, Typography, Paper, Box } from "@mui/material";

function HomePage(){
    const courses= [
        {
            "id": 0,
            "name": "Advanced Web Technologies",
            "description": "Test Description"
        },
        {
            "id": 1,
            "name": "Compilerbau",
            "description": "Test Description"
        },
        {
            "id": 2,
            "name": "IDEA Lab",
            "description": "Test Description"
        },
        {
            "id": 3,
            "name": " Bioinformatics",
            "description": "Test Description"
        },
        {
            "id": 4,
            "name": "Kommunikationspsychologie",
            "description": "Test Description"
        },
        {
            "id": 5,
            "name": "Digital Games Research",
            "description": "Test Description"
        }
    ];
    return(
        <>
        <Grid container spacing={2} sx={{justifyContent:'center'}}>
            <Grid container item xs={12}> 
                <Navbar/>
            </Grid>
            <Grid item xs={10}> 
                <SearchBar/>
            </Grid>
            <Grid container item xs={10}>
                <Grid container direction='row'>
                    <Grid item xs={3}>
                        {courses.map((course)=>(
                            <Paper key={course.id}>
                                <Typography>
                                    {course.name}
                                </Typography>
                            </Paper>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        </>
    )
}
export default HomePage;