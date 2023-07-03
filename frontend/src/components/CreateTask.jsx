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
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

// Function for showing the create new button
function CreateTask(props) {
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
        setQuizError(
          "Please select at least one correct answer for each question"
        );
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
    // onAssignmentCreated(assignment);

    // create form data to give to backend (needed for uploading files)
    const formData = new FormData();
    formData.append("type", "Assignment");
    formData.append("title", title);
    formData.append("description", description);
    formData.append("data", deadline);
    formData.append("files", files);
    formData.append("timeline", props.selectedCourseTimelineId);
    formData.append("subscriberTimelines", props.subscriberTimelines);
    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    props
      .createAndSaveAssignment(props.selectedCourseTimelineId, formData)
      .then((res) => {
        props.coursePageRerender(true);
      })
      .catch((err) => {
        alert(err);
      });

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
  const [anchorEl, setAnchorEl] = useState(null);
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
  if (props.isOwner) {
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

export default CreateTask;
