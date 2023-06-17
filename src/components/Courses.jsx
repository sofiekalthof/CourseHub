import { Card, CardContent, Grid, Typography, Paper, Box } from "@mui/material";

function Courses(){
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
        <Grid container xs={12} direction='row' rowSpacing={5} columnSpacing={3} sx={{flexGrow:1}}>
            {courses.map((course)=>(
                    <Grid item xs={4}>
                            <Paper key={course.id} sx={{height: 350, width: 350, textAlign:'center'}}>
                                <Typography>
                                    {course.name}
                                </Typography>
                                <Typography>
                                    {course.description}
                                </Typography>
                            </Paper>
                    </Grid>
            ))}
        </Grid>
        
        </>
    )
}

export default Courses;