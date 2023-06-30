import React, { useState } from "react";
import { Typography, Box, Checkbox, Button, FormControlLabel, Modal, Backdrop, Fade } from "@mui/material";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

function QuizTaking({ quiz, onBackToQuizList }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(quiz.questions.length).fill([]));
  const [showSummary, setShowSummary] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); // Added quizStarted state

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
            return userAnswer.filter((selectedAnswer) => selectedAnswer !== answerIndex);
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

  const handleBackToQuizList = () => {
    onBackToQuizList();
  };

  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach((userAnswer, index) => {
      if (userAnswer.every((selectedIndex) => quiz.questions[index].correctAnswerIndices.includes(selectedIndex))) {
        score += 1;
      }
    });
    return score;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const renderQuizQuestions = () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;
    const progressBarSize = Math.max(1, quiz.questions.length); // Calculate the size of the progress bar
    return (
      <>
        <Box sx={{ p: 2 }}>
          <Box mb={2}>
          
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                marginBottom: 2,
              }}
            >
               {/* Progress bar */}
              {[...Array(progressBarSize)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: `${100 / progressBarSize}%`,
                    height: 4,
                    backgroundColor: index === currentQuestionIndex ? "green" : "grey",
                    marginRight: 1,
                    borderRadius: 2,
                  }}
                />
              ))}
            </Box>

            <Typography variant="h5" gutterBottom>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="body1">{currentQuestion.text}</Typography>
          </Box>

          {currentQuestion.answers.map((answer, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={userAnswers[currentQuestionIndex].includes(index)}
                  onChange={handleAnswerChange}
                  value={index}
                />
              }
              label={answer}
            />
          ))}

          <Box mt={2}>
            <Button variant="contained" onClick={handlePreviousQuestion} disabled={isFirstQuestion}>
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
    const score = calculateScore();

    return (
      <>
        <Box   sx={{
                    p: 2,
                    mb: 2,
                    mt:2,
                    maxHeight: "600px",
                    overflow: "auto",
                  }}>
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
                      const isCorrect = question.correctAnswerIndices.includes(answerIndex);
                      const isSelected = userAnswers[index].includes(answerIndex);

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
            <Button variant="contained" onClick={handleBackToQuizList}>
              Back to Quiz List
            </Button>
          </Box>
        </Box>
      </>
    );
  };

  return (
    <div>
      <Modal
        open={true}
        onClose={handleBackToQuizList}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={true}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 1000,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              outline: "none",
            }}
          >
            {quizStarted ? (showSummary ? renderQuizSummary() : renderQuizQuestions()) : (
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
    </div>
  );
}

export default QuizTaking;
