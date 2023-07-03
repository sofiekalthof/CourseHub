import {
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Box,
  TextField,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Courses(props) {
  const courseIdDescs = props.courseIdDescs;
  const userData = props.user;

  // Navigate to the course page of selected course
  const navigate = useNavigate();
  const handleOnClick = (course) => {
    navigate(`/course/${course._id}`, {
      state: { courseId: course._id, user: userData },
      replace: true,
    });
  };

  // Function for searching a course
  const [searchInput, setSearchInput] = useState("");
  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Function for filtering the courses
  const filteredData = Object.values(courseIdDescs).filter((el) => {
    //if no input the return the original
    if (searchInput === "") {
      return el;
    }
    //return the item which contains the user input
    else {
      // case insensitive filtering
      return el.name.toLowerCase().includes(searchInput.toLowerCase());
    }
  });

  // console.log("filteredData in courses.jsx: ", filteredData);

  return (
    <>
      <Grid
        container
        direction="row"
        rowSpacing={7}
        columnSpacing={7}
        sx={{ flexGrow: 1 }}
      >
        {/* Searchbar for searching for courses */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Search for course"
            variant="outlined"
            sx={{ flexGrow: 1 }}
            onChange={handleChange}
            value={searchInput}
          />
        </Grid>
        {/* Show one card for each course */}
        {filteredData.map((courseIdDescs) => (
          <Grid item xs={4} key={courseIdDescs._id}>
            <Card
              sx={{
                height: 300,
                cursor: "pointer",
                border: "1.5px solid #5CDB95",
                borderRadius: "5px",
              }}
              onClick={() => handleOnClick(course)}
            >
              <CardContent>
                <Typography
                  gutterBottom
                  height={50}
                  variant="h6"
                  align="center"
                >
                  {courseIdDescs.name}
                </Typography>
                <Typography variant="body2" align="center">
                  {courseIdDescs.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Courses;
