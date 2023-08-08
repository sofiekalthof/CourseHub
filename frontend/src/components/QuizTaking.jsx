import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Checkbox,
  Button,
  FormControlLabel,
  Modal,
  Backdrop,
  Fade,
  DialogActions,
} from "@mui/material";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
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
      console.log("Frontend error. Post request could not be sent. Check API!");
    }
  }
}

/* The React component called "QuizTaking" handles the functionality of taking a
quiz. */
export default function QuizTaking(props) {
  const navigate = useNavigate();
  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);
  const [userAnswers, setUserAnswers] = useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [showSummary, setShowSummary] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); // Added quizStarted state
  const [open, setOpen] = useState(false);

  const quizId = props.quizId;
  const [quiz, setQuiz] = useState();

  useEffect(() => {
    GetTask(quizId)
      .then((res) => {
        setQuiz(res.task);
        setUserAnswers(Array(res.task.questions.length).fill([]));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  /**
   * The function handles changes in the user's selected answers by adding or removing the answer index
   * based on whether the checkbox is checked or unchecked.
   */
  const handleAnswerChange = (event) => {
    const answerIndex = parseInt(event.target.value);
    const isChecked = event.target.checked;

    setUserAnswers((prevUserAnswers) => {
      const updatedUserAnswers = prevUserAnswers.map((userAnswer, index) => {
        if (index === currentQuestionIndex) {
          if (isChecked) {
            // Add the answer index to the user's selected answers
            return [...userAnswer, answerIndex];
          } else {
            // Remove the answer index from the user's selected answers
            return userAnswer.filter(
              (selectedAnswer) => selectedAnswer !== answerIndex
            );
          }
        } else {
          return userAnswer;
        }
      });

      return updatedUserAnswers;
    });
  };

  /**
   * The function `handleNextQuestion` updates the current question index and shows the summary if it is
   * the last question.
   */
  const handleNextQuestion = () => {
    if (currentQuestionIndex === quiz.questions.length - 1) {
      setShowSummary(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  /**
   * The function `handlePreviousQuestion` decreases the value of `currentQuestionIndex` by 1 if it is
   * greater than 0.
   */
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  /**
   * The function `handleBackToQuizList` takes a score as a parameter and calls a function `takeTask`
   * with the selected course timeline ID, quiz ID, score, and null value. It then checks the response
   * status and message, and if unauthorized, alerts the user, logs them out, and navigates to the home
   * page. Otherwise, it closes a modal and triggers a rerender of the course page.
   */
  const handleBackToQuizList = (score) => {
    props
      .takeTask(props.selectedCourseTimelineId, props.quizId, score, null)
      .then((res) => {
        if (res.status === 401 && res.msg === "Unauthorized") {
          alert(res.msg);
          setUserSession(false);
          navigate("/");
        } else {
          setOpen(false);
          props.coursePageRerender(!props.coursePageRerenderValue);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * The function calculates the score of a user's answers by comparing them to the correct answers in a
   * quiz.
   * @returns The function `calculateScore` returns the score, which is the number of correct answers.
   */
  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach((userAnswer, index) => {
      if (
        userAnswer.every((selectedIndex) =>
          quiz.questions[index].correctAnswerIndices.includes(selectedIndex)
        )
      ) {
        score += 1;
      }
    });
    return score;
  };

  /**
   * The handleStartQuiz function sets the quizStarted state to true.
   */
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  /* The function called `renderQuizQuestions` returns JSX elements to render all quiz
question. */
  const renderQuizQuestions = () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];

    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    return (
      <>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Typography>

          <Box mb={2}>
            <Typography variant="body1">{currentQuestion.text}</Typography>
          </Box>

          {currentQuestion.image && (
            <Box mb={2} display="flex" justifyContent="center">
              <img
                src={`${import.meta.env.VITE_API_URL}/public/${
                  currentQuestion.image.fileName
                }`}
                alt={`Question ${currentQuestionIndex + 1}`}
                style={{
                  width: "500px",
                  height: "300px",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}

          {currentQuestion.answers.map((answer, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={userAnswers[currentQuestionIndex].includes(index)}
                  // changed to onClick, since onChange doesnt always work
                  onClick={handleAnswerChange}
                  value={index}
                />
              }
              label={answer}
            />
          ))}

          <Box mt={2}>
            <Button
              variant="contained"
              onClick={handlePreviousQuestion}
              disabled={isFirstQuestion}
            >
              Previous Question
            </Button>{" "}
            <Button variant="contained" onClick={handleNextQuestion}>
              {isLastQuestion ? "Finish Quiz" : "Next Question"}
            </Button>
          </Box>
        </Box>
      </>
    );
  };

  /* The function called `renderQuizSummary` is responsible for rendering a summary of a completed quiz. */
  const renderQuizSummary = () => {
    const score = calculateScore();

    return (
      <>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Quiz Completed Summary
          </Typography>

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body1" gutterBottom>
              Score: {score}/{quiz.questions.length}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Correct Answers:
            </Typography>
            <ul>
              {quiz.questions.map((question, index) => (
                <li key={index}>
                  <Typography variant="body2" gutterBottom>
                    Question {index + 1}: {question.text}
                  </Typography>
                  <ul>
                    {question.answers.map((answer, answerIndex) => {
                      const isCorrect =
                        question.correctAnswerIndices.includes(answerIndex);
                      const isSelected =
                        userAnswers[index].includes(answerIndex);

                      return (
                        <li key={answerIndex}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: 1,
                            }}
                          >
                            <Checkbox
                              checked={isCorrect}
                              color="success"
                              disabled
                              sx={{ marginRight: 1 }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: isCorrect ? "line-through" : "",
                                color: isSelected && !isCorrect ? "red" : "",
                              }}
                            >
                              {answer}
                            </Typography>
                          </Box>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </Box>

          <Box mt={2}>
            <Button
              variant="contained"
              onClick={() => handleBackToQuizList(score)}
            >
              Back to Quiz List
            </Button>
          </Box>
        </Box>
      </>
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
        Take Quiz
      </Button>
      {quiz && (
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
              {quizStarted ? (
                showSummary ? (
                  renderQuizSummary()
                ) : (
                  renderQuizQuestions()
                )
              ) : (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Quiz Information
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Deadline: {dayjs(quiz.deadline).format("LLL")}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Number of Questions: {quiz.questions.length}
                  </Typography>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>{" "}
                    <Button variant="contained" onClick={handleStartQuiz}>
                      Start Quiz
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
