import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Modal,
  Backdrop,
  Fade,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  Divider,
  DialogActions,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GetAppIcon from "@mui/icons-material/GetApp";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

dayjs.extend(localizedFormat);

/**
 * The function `GetTask` makes an API call to retrieve a specific task based on its ID.
 * @returns a Promise that resolves to the response JSON if the status is 200 (OK), an object with
 * status 401 and msg "Unauthorized" if the status is 401 (Unauthorized) and the response JSON msg is
 * "Unauthorized", or an object with status 500 and msg "Not successful and authorized" for any other
 * status code.
 */
async function GetTask(taskId) {
  // make API call to get all courses
  try {
    // send get request to REST API
    let res = await fetch(
      `${import.meta.env.VITE_API_URL}/courseGetTask/${taskId}`,
      {
        method: "GET",
        // header neccessary for correct sending of information
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      }
    );

    // parse return statement from backend
    let resJson = await res.json();

    if (res.status === 200) {
      return resJson;
    }
    if (res.status === 401 && resJson.msg === "Unauthorized") {
      return { status: 401, msg: "Unauthorized" };
    }
    return { status: 500, msg: "Not successful and authorized" };
  } catch (err) {
    if (typeof console === "undefined") {
      console = { log: function () {} };
    } else {
      console.log("Frontend error. Get request could not be sent. Check API!");
    }
  }
}

/* A React component called "AssignmentTaking" responsible for rendering a
button that allows the user to take an assignment. When the button is clicked, a modal is opened
that displays the details of the assignment, including its title, deadline, description, and any
uploaded files. The user can also provide a description for their answer and upload a file. Once the
user finishes the assignment by clicking the "Finish Assignment" button, the assignment details and
the uploaded answer file are sent to the backend for processing. If the submission is successful, a
summary of the assignment submission is displayed. */
export default function AssignmentTaking(props) {
  const navigate = useNavigate();
  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [answerFile, setAnswerFile] = useState(null);
  const assignmentId = props.assignmentId;
  const [assignment, setAssignment] = useState();

  /* The `useEffect` hook is used to perform side effects in a React component. In this case, the
`useEffect` hook is used to make an API call to retrieve a specific task based on its ID
(`assignmentId`). */
  useEffect(() => {
    GetTask(assignmentId)
      .then((res) => {
        setAssignment(res.task);
      })
      .catch((err) => {
        if (typeof console === "undefined") {
          console = { log: function () {} };
        } else {
          console.log(err);
        }
      });
  }, []);

  /**
   * The function `handleDescriptionChange` updates the `description` state with the value of the event
   * target.
   */
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  /**
   * The function `handleFinishAssignment` handles the submission of an assignment by sending the
   * necessary data to the server.
   */
  const handleFinishAssignment = () => {
    const formData = new FormData();
    formData.append("timelineId", props.selectedCourseTimelineId);
    formData.append("taskId", props.assignmentId);
    formData.append("uploadedAssignmentDescription", description);
    formData.append("score", 0);
    formData.append("allFiles", answerFile);
    props
      .takeTask(props.selectedCourseTimelineId, props.assignmentId, 0, formData)
      .then((res) => {
        if (res.status === 401 && res.msg === "Unauthorized") {
          alert(res.msg);
          setUserSession(false);
          navigate("/");
        } else {
          setShowSummary(true);
        }
      })
      .catch((err) => {
        if (typeof console === "undefined") {
          console = { log: function () {} };
        } else {
          console.log(err);
        }
      });
  };

  /**
   * The function `handleAnswerFileChange` is used to handle the change event of a file input and update
   * the state variable `answerFile` with the uploaded file.
   */
  const handleAnswerFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setAnswerFile(uploadedFile);
  };

  /**
   * The function handles closing a modal and triggering a re-render of the course page.
   */
  const handleBackToAssignmentList = () => {
    setOpen(false);
    props.coursePageRerender(!props.coursePageRerenderValue);
  };

  /* The `renderAssignmentSummary` function is a helper function that returns JSX code for rendering a
 summary of the assignment submission. It displays the assignment submission details, including the
 description and the name of the uploaded answer file. It also includes a button to go back to the
 assignment list. */
  const renderAssignmentSummary = () => {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Assignment Submitted
        </Typography>
        <Typography variant="body1" gutterBottom>
          Description: {description}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Answer File: {answerFile && answerFile.name}
        </Typography>
        <Box mt={2}>
          <Button variant="contained" onClick={handleBackToAssignmentList}>
            Back to Assignment List
          </Button>
        </Box>
      </Box>
    );
  };

  /**
   * The handleClick function sets the state variable "open" to true.
   */
  const handleClick = () => {
    setOpen(true);
  };

  /**
   * The function handleClose sets the value of the variable "open" to false.
   */
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="text" onClick={handleClick}>
        Take Assignment
      </Button>
      {assignment && (
        <Modal
          open={open}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: 600,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 2,
                outline: "none",
              }}
            >
              {showSummary ? (
                renderAssignmentSummary()
              ) : (
                <Box sx={{ p: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    Assignment Details
                  </Typography>
                  <Divider sx={{ my: 2 }} /> {/* Line separating sections */}
                  <Typography variant="body1" gutterBottom>
                    Title: {assignment.title}
                  </Typography>
                  <Divider sx={{ my: 2 }} /> {/* Line separating sections */}
                  <Typography variant="body1" gutterBottom>
                    Deadline: {dayjs(assignment.deadline).format("LLL")}
                  </Typography>
                  <Divider sx={{ my: 2 }} /> {/* Line separating sections */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      Description:
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {assignment.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} /> {/* Line separating sections */}
                  </Box>
                  {assignment.files && (
                    <Box mb={2}>
                      <Typography variant="body1" gutterBottom>
                        Uploaded Files:
                      </Typography>
                      <List>
                        {assignment.files.map((file, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <DescriptionIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={file.originalFileName.split(".")[0]}
                              secondary={file.originalFileName.split(".")[1]}
                            />
                            <IconButton
                              href={`${import.meta.env.VITE_API_URL}/download/${
                                file.fileName
                              }/${file.originalFileName}`}
                              download
                            >
                              <GetAppIcon />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      Answer Description:
                    </Typography>
                    <TextField
                      value={description}
                      onChange={handleDescriptionChange}
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    />
                  </Box>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleAnswerFileChange}
                    style={{ display: "none" }}
                    id="upload-answer"
                  />
                  <label htmlFor="upload-answer">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Answer
                    </Button>
                  </label>
                  {answerFile && (
                    <Typography variant="body1" gutterBottom>
                      Selected Answer File: {answerFile.name}
                    </Typography>
                  )}
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>{" "}
                    <Button
                      variant="contained"
                      onClick={handleFinishAssignment}
                    >
                      Finish Assignment
                    </Button>
                  </DialogActions>
                </Box>
              )}
            </Box>
          </Fade>
        </Modal>
      )}
    </>
  );
}
