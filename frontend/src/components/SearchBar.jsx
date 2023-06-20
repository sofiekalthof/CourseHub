import {TextField, Grid} from "@mui/material";
import { useState } from 'react';


function SearchBar(){

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