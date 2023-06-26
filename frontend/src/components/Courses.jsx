import { Card, CardContent, Grid, Typography, Paper, Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import CoursePage from "./CoursePage";


function Courses(props){
    const courses = props.courses;
    const userData = props.user;

    // Navigate to the course page of selected course
    const navigate = useNavigate();
    const handleOnClick =(course) => {
        navigate(`/course/${course.id}`, {state:{user: userData}, replace: true});
    }

    // Function for searching a course
    const [searchInput, setSearchInput] = useState("");
    const handleChange = (e) => {
        setSearchInput(e.target.value);
    }

    // Function for filtering the courses
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
            {/* Searchbar for searching for courses */}
            <Grid item xs={12}>
                <TextField fullWidth label="Search for course" variant="outlined" sx={{flexGrow:1}} onChange={handleChange} value={searchInput}/>
            </Grid>
            {/* Show one card for each course */}
            {filteredData.map((course)=>(
                    <Grid item xs={4} key={course.id}>
                            <Card sx={{minHeight:300, minWidth:250, textAlign:'center', cursor: 'pointer', border: '1px solid #5CDB95'}} onClick={() => handleOnClick(course)}>
                                <CardContent>
                                    <Typography gutterBottom height={50} variant="h6" align="center">
                                        {course.name}
                                    </Typography>
                                    <Typography variant="body2" align="center">
                                        {course.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                    </Grid>
            ))}
        </Grid>
        
        </>
    )
}

export default Courses;