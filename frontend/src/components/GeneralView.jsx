import * as React from "react";
import Timeline from "./Timeline";
import ApexTimeline from "./ApexTimeline";
import ApexTimelineScatter from "./ApexTimelineScatter";
import {
  Grid,
  Box,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  TextField,
  Checkbox,
  Typography,
  Card,
} from "@mui/material";
import AssignmentList from "./AssignmentList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

// Function for showing the create new button
function CreateNew({ isOwner }) {
  // Quizz Creation start
  // State variables
  const [openQuiz, setQuizOpen] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: uuidv4(),
      text: "",
      answers: ["", "", "", ""],
      correctAnswerIndices: [],
      image: null,
    },
  ]);
  const [errorQuiz, setQuizError] = useState("");
  const [deadlineQuiz, setQuizDeadline] = useState(null);

  // Function to open the dialog
  const handleQuizOpen = () => {
    setQuizOpen(true);
  };

  // Function to close the dialog
  const handleQuizClose = () => {
    setQuizOpen(false);
    setQuizError("");
  };

  // Function to handle quiz title change
  const handleQuizTitleChange = (event) => {
    setQuizTitle(event.target.value);
  };
  const handleQuizDeadlineChange = (date) => {
    setQuizDeadline(date);
  };

  // Function to handle question text change
  const handleQuestionTextChange = (value, questionId) => {
    // Update the text of the specific question
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        return { ...question, text: value };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  // Function to handle answer text change
  const handleAnswerTextChange = (event, questionId, answerIndex) => {
    // Update the answer text of the specific question
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        const updatedAnswers = [...question.answers];
        updatedAnswers[answerIndex] = event.target.value;
        return { ...question, answers: updatedAnswers };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  // Function to handle correct answer change
  const handleCorrectAnswerChange = (event, questionId, answerIndex) => {
    // Update the correct answer indices of the specific question
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        let updatedIndices = [...question.correctAnswerIndices];
        if (event.target.checked) {
          updatedIndices.push(answerIndex);
        } else {
          updatedIndices = updatedIndices.filter(
            (index) => index !== answerIndex
          );
        }
        return { ...question, correctAnswerIndices: updatedIndices };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  // Function to handle question file change
  const handleQuestionFileChange = (event, questionId) => {
    // Read and update the image file of the specific question
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedQuestions = questions.map((question) => {
        if (question.id === questionId) {
          return { ...question, image: e.target.result };
        }
        return question;
      });
      setQuestions(updatedQuestions);
    };
    reader.readAsDataURL(file);
  };

  // Function to add a new question
  const addQuestion = () => {
    const newQuestion = {
      id: uuidv4(),
      text: "",
      answers: ["", "", "", ""],
      correctAnswerIndices: [],
      image: null,
    };
    setQuestions([...questions, newQuestion]);
  };

  // Function to remove a question
  const removeQuestion = (questionId) => {
    // Filter out the question with the specified ID
    const updatedQuestions = questions.filter(
      (question) => question.id !== questionId
    );
    setQuestions(updatedQuestions);
  };

  // Function to handle quiz creation
  const handleCreateQuiz = () => {
    // Validate quiz data before creating
    if (quizTitle.trim() === "") {
      setQuizError("Please enter a quiz title");
      return;
    }
    if (deadline === null) {
      setQuizError("Please select a deadline");
      return;
    }

    for (const question of questions) {
      if (question.text.trim() === "") {
        setQuizError("Please fill in all the question fields");
        return;
      }
      if (question.correctAnswerIndices.length === 0) {
        setQuizError("Please select at least one correct answer for each question");
        return;
      }
    }

    // Create the quiz object
    const quiz = {
      title: quizTitle,
      questions: questions.map(
        ({ id, text, answers, correctAnswerIndices, image, deadline }) => ({
          id,
          text,
          answers,
          correctAnswerIndices,
          image,
          deadline,
        })
      ),
    };

    // Pass the created quiz to the parent component
    onQuizCreated(quiz);

    // Reset form fields and error
    setQuizTitle("");
    setQuestions([
      {
        id: uuidv4(),
        text: "",
        answers: ["", "", "", ""],
        correctAnswerIndices: [],
        image: null,
      },
    ]);
    setQuizError("");

    // Close the dialog
    handleQuizClose();
  };

  // Quizz creation end
  // AssignmentCreation start
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [deadline, setDeadline] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);

    // Check the file conditions before adding to the state
    const validFiles = uploadedFiles.filter((file) => {
      // Check the file type
      const fileType = file.type;
      const allowedFileTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
      ];
      if (!allowedFileTypes.includes(fileType)) {
        console.log(`Invalid file type: ${fileType}`);
        return false;
      }

      // Check the file size (in bytes)
      const fileSize = file.size;
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      if (fileSize > maxFileSize) {
        console.log(`File size exceeds the limit: ${fileSize}`);
        return false;
      }

      return true; // File meets the conditions
    });

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleDeleteFile = (file) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const handleDeadlineChange = (date) => {
    setDeadline(date);
  };

  const handleSubmit = () => {
    if (title.trim() === "") {
      setError("Please enter a title");
      return;
    }

    if (description.trim() === "") {
      setError("Please enter a description");
      return;
    }

    if (deadline === null) {
      setError("Please select a deadline");
      return;
    }

    const assignment = {
      title,
      description,
      files,
      deadline,
    };
    onAssignmentCreated(assignment);
    setTitle("");
    setDescription("");
    setFiles([]);
    setDeadline(null);
    setIsDialogOpen(false);
    setError(""); // Clear the error after successful submission
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setError(""); // Clear the error when closing the dialog
    setAnchorEl(null); // close drop-down
  };
  // AssignmentCreation end
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Function for showing the dropdown list for creating new task
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function for closing dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Show Create New button only when user is owner of the course
  if (isOwner) {
    return (
      <>
        <Button
          variant="contained"
          endIcon={<KeyboardArrowDownIcon />}
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Create New
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleQuizOpen}>Quiz</MenuItem>
          <MenuItem onClick={handleDialogOpen}>Assignment</MenuItem>
        </Menu>
        <Dialog open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Create new Assignment</DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              <TextField
                label="Title"
                value={title}
                onChange={handleTitleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={description}
                onChange={handleDescriptionChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ marginBottom: "16px" }}
                multiple
              />
              {files.length > 0 && (
                <List>
                  {files.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={file.name} />
                      <IconButton onClick={() => handleDeleteFile(file)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              )}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoItem label="DateTimePicker">
                  <DateTimePicker
                    value={deadline}
                    onChange={handleDeadlineChange}
                    disablePast
                    views={["year", "month", "day", "hours", "minutes"]}
                  />
                </DemoItem>
              </LocalizationProvider>
              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openQuiz}
          onClose={handleQuizClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create New Quiz</DialogTitle>
          <DialogContent dividers>
            {errorQuiz && (
              <Typography variant="body1" color="error" gutterBottom>
                {errorQuiz}
              </Typography>
            )}
            <TextField
              label="Quiz Title"
              value={quizTitle}
              onChange={handleQuizTitleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem label="deadline">
                <DateTimePicker
                  value={deadlineQuiz}
                  onChange={handleQuizDeadlineChange}
                  disablePast
                  views={["year", "month", "day", "hours", "minutes"]}
                />
              </DemoItem>
            </LocalizationProvider>
            <Grid container spacing={2}>
              {questions.map((question) => (
                <Grid item xs={12} key={question.id}>
                  <Box
                    sx={{
                      border: 1,
                      p: 2,
                      mb: 2,
                      mt: 2,
                      maxHeight: "300px",
                      overflow: "auto",
                    }}
                  >
                    <TextField
                      label="Question"
                      value={question.text}
                      onChange={(event) =>
                        handleQuestionTextChange(
                          event.target.value,
                          question.id
                        )
                      }
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <Grid container spacing={2}>
                      {question.answers.map((answer, answerIndex) => (
                        <Grid item xs={12} key={answerIndex}>
                          <TextField
                            label={`Answer ${answerIndex + 1}`}
                            value={answer}
                            onChange={(event) =>
                              handleAnswerTextChange(
                                event,
                                question.id,
                                answerIndex
                              )
                            }
                            fullWidth
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={question.correctAnswerIndices.includes(
                                  answerIndex
                                )}
                                onChange={(event) =>
                                  handleCorrectAnswerChange(
                                    event,
                                    question.id,
                                    answerIndex
                                  )
                                }
                              />
                            }
                            label="Correct Answer"
                            sx={{ ml: 1 }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleQuestionFileChange(event, question.id)
                      }
                      sx={{ mt: 2 }}
                    />

                    {questions.length > 1 && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeQuestion(question.id)}
                        sx={{ mt: 2 }}
                      >
                        Remove Question
                      </Button>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Button variant="outlined" onClick={addQuestion}>
              Add Question
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleQuizClose}>Cancel</Button>
            <Button onClick={handleCreateQuiz} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

// Function for Showing the Add Milestone button
function AddMileStone({ isOwner }) {
  const [open, setOpen] = useState(false);
  const [milestoneType, setMilestoneType] = useState("");
  const [date, setDate] = useState(dayjs());

  // Function for opening the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function for canceling the milestone creation
  const handleClickCancel = () => {
    setOpen(false);
    setMilestoneType("");
    setDate(dayjs());
  };

  // Function for saving the milestone
  // TODO: Connection to backend
  const handleClickSave = () => {};

  // Function for selecting milestone type
  const handleChange = (event) => {
    setMilestoneType(event.target.value);
  };

  // Show MileStone Button only when user is owner of course
  if (isOwner) {
    return (
      <>
        <Button variant="outlined" onClick={handleClickOpen}>
          Add Milestone
        </Button>
        {/* Dialog for adding a new Milestone */}
        <Dialog open={open}>
          <DialogTitle>Add a milestone</DialogTitle>
          <DialogContent>
            {/* Dropdown Menu for selecting the Milestone Type */}
            <FormControl fullWidth>
              <InputLabel>Milestone Type</InputLabel>
              <Select
                value={milestoneType}
                label="MileStone Type"
                onChange={handleChange}
              >
                <MenuItem value={"Lecture"}>Lecture</MenuItem>
                <MenuItem value={"Exercise"}>Exercise</MenuItem>
                <MenuItem value={"Exam"}>Exam</MenuItem>
              </Select>
            </FormControl>
            {/* DatePicker for Selecting Milestone Date */}
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={date}
                  onChange={(date) => setDate(date)}
                ></DatePicker>
              </LocalizationProvider>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClickSave}>Save</Button>
            <Button onClick={handleClickCancel}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

function GeneralView(props) {
  const [isOwner, setIsOwner] = useState(props.isOwner);

  return (
    <>
      <Grid container sx={{ justifyContent: "center" }} spacing={2}>
        <Grid item xs={10.25}>
          <Typography>Timeline</Typography>
        </Grid>
        {/* Button for adding a milestone */}
        <Grid item xs={1.75}>
          <AddMileStone isOwner={isOwner}></AddMileStone>
        </Grid>
        {/* Showing timeline */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ justifyContent: "center" }}>
            <ApexTimelineScatter
              tasks={props.selectedCourse.timeline.tasks}
              milestones={props.selectedCourse.timeline.milestones}
              user={props.user}
            ></ApexTimelineScatter>
          </Card>
        </Grid>
        <Grid item xs={10.25}>
          <Typography>Assignments and Quizzes</Typography>
        </Grid>
        {/* Button for creating a new task */}
        <Grid item xs={1.75}>
          <CreateNew isOwner={isOwner}></CreateNew>
        </Grid>
        {/* Showing Assignmentlist */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ justifyContent: "center" }}>
            <AssignmentList
              tasks={props.selectedCourse.timeline.tasks}
              user={props.user}
              userDataForCourse={props.userDataForCourse}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default GeneralView;
