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

// Function to return all courses in database (parsed for frontend)
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
    console.log("Frontend error. Get request could not be sent. Check API!");
  }
}

function AssignmentTaking(props) {
  // const testRerender = props.dataOfAllUsersForThisCourse;
  // console.log("QuizTaking called wit Id: ", props.quizId);
  const navigate = useNavigate();
  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [answerFile, setAnswerFile] = useState(null);
  const assignmentId = props.assignmentId;
  // console.log("quizId in QuizTaking: ", quizId);
  const [assignment, setAssignment] = useState();

  useEffect(() => {
    // console.log("inUseEffect of QuizTaking");
    GetTask(assignmentId)
      .then((res) => {
        console.log("res in AssignmentTaking: ", res);
        // console.log(
        //   "Array(quiz.questions.length).fill([]) in QuizTaking: ",
        //   Array(quiz.questions.length).fill([])
        // );
        setAssignment(res.task);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // const handleFileChange = (event) => {
  //   setFile(event.target.files[0]);
  // };

  const handleFinishAssignment = () => {
    console.log("handleFinishAssignment in AssignmentTaking called");
    // console.log("score: ", score);
    // console.log("inUseEffect of QuizTaking");
    // create form data to give to backend (needed for uploading files)
    const formData = new FormData();
    formData.append("timelineId", props.selectedCourseTimelineId);
    formData.append("taskId", props.assignmentId);
    formData.append("uploadedAssignmentDescription", description);
    formData.append("score", 0);
    // The following loop was the solution
    formData.append("allFiles", answerFile);
    props
      .takeTask(props.selectedCourseTimelineId, props.assignmentId, 0, formData)
      .then((res) => {
        console.log("res: ", res);
        if (res.status === 401 && res.msg === "Unauthorized") {
          alert(res.msg);
          setUserSession(false);
          navigate("/");
        } else {
          setShowSummary(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAnswerFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setAnswerFile(uploadedFile);
  };

  const handleBackToAssignmentList = () => {
    console.log("closing the modal: ");
    setOpen(false);
    console.log("re-rendering");
    props.coursePageRerender(!props.coursePageRerenderValue);
  };

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
          File: {file && file.name}
        </Typography>
        <Box mt={2}>
          <Button variant="contained" onClick={handleBackToAssignmentList}>
            Back to Assignment List
          </Button>
        </Box>
      </Box>
    );
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
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
    </div>
  );
}

export default AssignmentTaking;
