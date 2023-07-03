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
          <Grid item xs={12} sm={6} md={6} lg={4} key={courseIdDescs._id}>
            <Card
              sx={{
                height: 300,
                cursor: "pointer",
                border: "1.5px solid #5CDB95",
                borderRadius: "5px",
              }}
              onClick={() => handleOnClick(courseIdDescs)}
            >
              <Box sx={{ backgroundColor: "primary.main", minHeight: 50 }}>
                <Tooltip title={courseIdDescs.name}>
                  <Typography
                    variant="h6"
                    align="center"
                    height={50}
                    gutterBottom
                    sx={{ paddingTop: 1 }}
                    noWrap
                  >
                    {courseIdDescs.name}
                  </Typography>
                </Tooltip>
              </Box>
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Tooltip title={courseIdDescs.description}>
                    <Typography
                      variant="body2"
                      sx={{
                        paddingLeft: 3,
                        paddingRight: 3,
                        paddingTop: 3,
                        paddingBottom: 3,
                      }}
                    >
                      {courseIdDescs.description}
                    </Typography>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Courses;
