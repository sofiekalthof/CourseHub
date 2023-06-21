import { Card, CardContent, Grid, Typography, Paper, Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import CoursePage from "./CoursePage";
import {courses} from '../data/courses'

function Courses(){
    const navigate = useNavigate();
    const handleOnClick =(course) => {
        navigate(`/course/${course.id}`);
    }

    const [searchInput, setSearchInput] = useState("");
    const handleChange = (e) => {
        setSearchInput(e.target.value);
    }

    const filteredData = courses.filter((el) => {
        //if no input the return the original
        if (searchInput === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            return el.name.includes(searchInput)
        }
    })


    return(
        <>
        <Grid container direction='row' rowSpacing={7} columnSpacing={7} sx={{flexGrow:1}}>
            <Grid item xs={12}>
            <TextField fullWidth label="Search for course" variant="outlined" sx={{flexGrow:1}} onChange={handleChange} value={searchInput}/>
            </Grid>
            {filteredData.map((course)=>(
                    <Grid item xs={4} key={course.id}>
                            <Card sx={{minHeight:200, minWidth:250, textAlign:'center', cursor: 'pointer'}} onClick={() => handleOnClick(course)}>
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