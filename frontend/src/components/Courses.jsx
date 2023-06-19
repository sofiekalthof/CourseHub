import { Card, CardContent, Grid, Typography, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();
    const handleOnClick =() => {
        navigate('/course')
    }


    return(
        <>
        <Grid container direction='row' rowSpacing={5} columnSpacing={3} sx={{flexGrow:1}}>
            {courses.map((course)=>(
                    <Grid item xs={4} key={course.id}>
                            <Card sx={{minHeight:300, textAlign:'center'}} onClick={handleOnClick}>
                                <Typography>
                                    {course.name}
                                </Typography>
                                <Typography>
                                    {course.description}
                                </Typography>
                            </Card>
                    </Grid>
            ))}
        </Grid>
        
        </>
    )
}

export default Courses;