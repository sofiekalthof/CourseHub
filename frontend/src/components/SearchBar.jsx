import {TextField, Grid} from "@mui/material";
import { useState } from 'react';
import { courses } from "../data/courses";


function SearchBar(){
    const [searchInput, setSearchInput] = useState("");
    const handleChange = (e) => {
        setSearchInput(e.target.value);
        console.log(searchInput)
    }

    if(searchInput.length > 0){
        courses.filter((course) => {
            return course.name.match(searchInput);
        })
    }

    return(
        <>
        <TextField fullWidth label="Search for course" variant="outlined" sx={{flexGrow:1}} onChange={handleChange} value={searchInput}>

        </TextField>

        </>
    )
}

export default SearchBar;