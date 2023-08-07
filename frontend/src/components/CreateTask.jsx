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
  FormControl,
  FormControlLabel,
  TextField,
  Checkbox,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

/* A React component called "CreateTask" that allows the user to create new tasks,
specifically quizzes and assignments. */
export default function CreateTask(props) {
  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);
  const navigate = useNavigate();
  // Quiz Creation start
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

  /**
   * The function `handleQuizOpen` sets the state variable `quizOpen` to `true`.
   */
  const handleQuizOpen = () => {
    setQuizOpen(true);
  };

  /**
   * The function `handleQuizClose` is used to reset the state variables related to a quiz and close the
   * quiz.
   */
  const handleQuizClose = () => {
    setQuizOpen(false);
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
    setAnchorEl(null); // close drop-down
  };

  /**
   * The function `handleQuizTitleChange` updates the state variable `quizTitle` with the value of the
   * input field.
   */
  const handleQuizTitleChange = (event) => {
    setQuizTitle(event.target.value);
  };
  /**
   * The function `handleQuizDeadlineChange` sets the quiz deadline to the provided date.
   */
  const handleQuizDeadlineChange = (date) => {
    setQuizDeadline(date);
  };

  /**
   * The function `handleQuestionTextChange` updates the text of a specific question in an array of
   * questions.
   */
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

  /**
   * The function handles the change in answer text for a specific question in a React component.
   */
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

  /**
   * The function handles the change of the correct answer for a specific question in a React component.
   */
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

  /**
   * The function handles the change event when a file is uploaded for a specific question, checks the
   * file conditions (type and size), and updates the state with the uploaded file.
   * @returns The function `handleQuestionFileChange` returns nothing (undefined).
   */
  const handleQuestionFileChange = (event, questionId) => {
    const uploadedFile = event.target.files[0];

    // Check the file conditions before adding to the state
    // Check the file type
    const fileType = uploadedFile.type;
    const allowedFileTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!allowedFileTypes.includes(fileType)) {
      setQuizError(`Invalid file type: ${fileType}`);
      return;
    }

    // Check the file size (in bytes)
    const fileSize = uploadedFile.size;
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (fileSize > maxFileSize) {
      setQuizError(`File size exceeds the limit: ${fileSize}`);
      return;
    }

    // File meets the conditions
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        return { ...question, image: uploadedFile };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  /**
   * The `addQuestion` function adds a new question object to an array of questions.
   */
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

  /**
   * The `removeQuestion` function removes a question from an array of questions based on its ID.
   */
  const removeQuestion = (questionId) => {
    // Filter out the question with the specified ID
    const updatedQuestions = questions.filter(
      (question) => question.id !== questionId
    );
    setQuestions(updatedQuestions);
  };

  /**
   * The function `handleCreateQuiz` is used to validate and create a quiz, and then reset the form
   * fields and error messages.
   * @returns The function `handleCreateQuiz` does not explicitly return anything.
   */
  const handleCreateQuiz = () => {
    // Validate quiz data before creating
    if (quizTitle.trim() === "") {
      setQuizError("Please enter a quiz title");
      return;
    }
    if (deadlineQuiz === null) {
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
      for (const answer of question.answers) {
        if (answer.trim() === "") {
          setQuizError("Please fill in all the answer fields");
          return;
        }
      }
    }

    // create form data to give to backend (needed for uploading files)
    const formData = new FormData();
    formData.append("type", "Quiz");
    formData.append("title", quizTitle);
    formData.append("data", deadlineQuiz);
    for (const question of questions) {
      formData.append("text", question.text);
      formData.append("answers", JSON.stringify(question.answers));
      formData.append(
        "correctAnswerIndices",
        JSON.stringify(question.correctAnswerIndices)
      );
      formData.append("allFiles", question.image);
    }
    formData.append("timeline", props.selectedCourseTimelineId);
    formData.append("subscriberTimelines", props.subscriberTimelines);
    props
      .createAndSaveTask(props.selectedCourseTimelineId, formData)
      .then((res) => {
        if (res.status === 401 && res.msg === "Unauthorized") {
          alert(res.msg);
          setUserSession(false);
          navigate("/");
        } else {
          props.coursePageRerender(!props.coursePageRerenderValue);
          setAnchorEl(null);
        }
      })
      .catch((err) => {
        console.log(err);
        // alert(err);
      });

    // Reset form fields and error
    setQuizTitle("");
    setQuizDeadline(null);
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

  // Quiz creation end

  // Assignment Creation start
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [deadline, setDeadline] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");

  /**
   * The function `handleTitleChange` updates the value of the `title` state variable based on the value
   * of an input field.
   */
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  /**
   * The `handleDescriptionChange` function updates the description state with the value of the event
   * target.
   */
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  /**
   * The function `handleFileChange` checks the file type and size before adding the valid files to the
   * state.
   */
  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);

    // Check the file conditions before adding to the state
    const validFiles = uploadedFiles.filter((file) => {
      // Check the file type
      const fileType = file.type;
      const allowedFileTypes = ["application/pdf", "image/jpeg", "image/png"];
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

  /**
   * The handleDeleteFile function removes a specific file from the files array.
   */
  const handleDeleteFile = (file) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  /**
   * The function `handleDeadlineChange` updates the `deadline` state with the provided `date` value.
   */
  const handleDeadlineChange = (date) => {
    setDeadline(date);
  };

  /**
   * The handleSubmit function is used to handle form submission in a React component, performing
   * validation checks and sending data to the backend server.
   * @returns The function does not explicitly return anything.
   */
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
    // The following loop was the solution
    for (const file of files) {
      formData.append("allFiles", file);
    }
    formData.append("timeline", props.selectedCourseTimelineId);
    formData.append("subscriberTimelines", props.subscriberTimelines);
    props
      .createAndSaveTask(props.selectedCourseTimelineId, formData)
      .then((res) => {
        if (res.status === 401 && res.msg === "Unauthorized") {
          alert(res.msg);
          setUserSession(false);
          navigate("/");
        } else {
          props.coursePageRerender(!props.coursePageRerenderValue);
          setAnchorEl(null);
        }
      })
      .catch((err) => {
        console.log(err);
        // alert(err);
      });

    setTitle("");
    setDescription("");
    setFiles([]);
    setDeadline(null);
    setIsDialogOpen(false);
    setError(""); // Clear the error after successful submission
  };

  /**
   * The function `handleDialogOpen` sets the state variable `isDialogOpen` to `true`.
   */
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  /**
   * The function `handleDialogClose` is used to close the assignment dialog box and reset its state variables.
   */
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setTitle("");
    setDescription("");
    setFiles([]);
    setDeadline(null);
    setError(""); // Clear the error when closing the dialog
    setAnchorEl(null); // close drop-down
  };
  // Assignment Creation end

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  /**
   * The handleDropDownClick function sets the anchor element to the current target of the event and opens the dropdown.
   */
  const handleDropDownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * The function `handleDropDownClose` sets the `anchorEl` state to `null` and closes the dropdown.
   */
  const handleDropDownClose = () => {
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
          onClick={handleDropDownClick}
        >
          Create New
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleDropDownClose}
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
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Title"
                    value={title}
                    onChange={handleTitleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Deadline"
                        value={deadline}
                        onChange={handleDeadlineChange}
                        disablePast
                        views={["year", "month", "day", "hours", "minutes"]}
                      />
                    </LocalizationProvider>

                    {error && (
                      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {error}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{ display: "none", marginBottom: "16px" }}
                    multiple
                    id="upload-answer"
                  />
                  <label htmlFor="upload-answer">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload File
                    </Button>
                  </label>
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
                </Grid>
              </Grid>
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Deadline"
                      value={deadlineQuiz}
                      onChange={handleQuizDeadlineChange}
                      disablePast
                      views={["year", "month", "day", "hours", "minutes"]}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                {questions.map((question, index) => (
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
                    <Grid container>
                      <Grid item xs={12} key={question.id}>
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
                          style={{ mt: 2, display: "none" }}
                          id={index}
                        />
                        <label htmlFor={index}>
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                          >
                            Upload File
                          </Button>
                        </label>
                        {question.image && (
                          <Typography variant="body1" gutterBottom>
                            Selected Question File: {question.image.name}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} key={question.id + "0"}>
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
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Grid>
              <Button variant="outlined" onClick={addQuestion}>
                Add Question
              </Button>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleQuizClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateQuiz}
              color="primary"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
