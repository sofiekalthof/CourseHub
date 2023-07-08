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
} from "@mui/material";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
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

function QuizTaking(props) {
  const testRerender = props.dataOfAllUsersForThisCourse;
  // console.log("QuizTaking called wit Id: ", props.quizId);
  const navigate = useNavigate();
  // use existing session
  const [userSession, setUserSession] = useContext(UserContext);
  const [userAnswers, setUserAnswers] = useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [showSummary, setShowSummary] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); // Added quizStarted state
  const [open, setOpen] = useState(false);

  const quizId = props.quizId;
  // console.log("quizId in QuizTaking: ", quizId);
  const [quiz, setQuiz] = useState();

  useEffect(() => {
    // console.log("inUseEffect of QuizTaking");
    GetTask(quizId)
      .then((res) => {
        console.log("res in QuizTaking: ", res);
        // console.log(
        //   "Array(quiz.questions.length).fill([]) in QuizTaking: ",
        //   Array(quiz.questions.length).fill([])
        // );
        setQuiz(res.task);
        setUserAnswers(Array(res.task.questions.length).fill([]));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAnswerChange = (event) => {
    // console.log("handleAnswerChange called");
    const answerIndex = parseInt(event.target.value);
    const isChecked = event.target.checked;
    // console.log("answerIndex: ", answerIndex);
    // console.log("isChecked: ", isChecked);

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

  const handleNextQuestion = () => {
    if (currentQuestionIndex === quiz.questions.length - 1) {
      setShowSummary(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleBackToQuizList = (score) => {
    console.log("handleBackToQuizList in QuizTaking called");
    // console.log("score: ", score);
    // console.log("inUseEffect of QuizTaking");
    props
      .takeTask(props.selectedCourseTimelineId, props.quizId, score, null)
      .then((res) => {
        console.log("res: ", res);
        if (res.status === 401 && res.msg === "Unauthorized") {
          alert(res.msg);
          setUserSession(false);
          navigate("/");
        } else {
          console.log("closing the modal: ");
          setOpen(false);
          console.log("re-rendering");
          props.coursePageRerender(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const calculateScore = () => {
    // console.log("calculateScore");
    // console.log("userAnswers: ", userAnswers);
    // console.log("quiz: ", quiz);
    // console.log("quiz.questions: ", quiz.questions);

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

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const renderQuizQuestions = () => {
    // console.log("quiz: ", quiz);
    // console.log("currentQuestionIndex: ", currentQuestionIndex);
    // console.log("userAnswers: ", userAnswers);
    const currentQuestion = quiz.questions[currentQuestionIndex];
    console.log("currentQuestion: ", currentQuestion);

    // console.log("currentQuestion: ", currentQuestion);
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

  const renderQuizSummary = () => {
    console.log("renderQuizSummary");
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

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClick}>
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
                  <Box mt={2}>
                    <Button variant="contained" onClick={handleStartQuiz}>
                      Start Quiz
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Fade>
        </Modal>
      )}
    </div>
  );
}

export default QuizTaking;
