import React, { useState } from 'react';
import {
  Typography,
  Box,
  Radio,
  Button,
  FormControlLabel,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';

function QuizTaking({ quiz, onBackToQuizList }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Maintain the index of the current question
  const [userAnswers, setUserAnswers] = useState(Array(quiz.questions.length).fill(null)); // Store user's answers for each question
  const [showSummary, setShowSummary] = useState(false); // Flag to determine if the quiz summary should be displayed

  const handleAnswerChange = (event) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = parseInt(event.target.value); // Update the user's answer for the current question
    setUserAnswers(updatedUserAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === quiz.questions.length - 1) { // If it's the last question
      setShowSummary(true); // Show the quiz summary
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the next question
    }
  };

  const handleBackToQuizList = () => {
    onBackToQuizList(); // Call the provided callback function to navigate back to the quiz list
  };

  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach((userAnswer, index) => {
      if (userAnswer === quiz.questions[index].correctAnswerIndex) { // Check if the user's answer matches the correct answer for each question
        score += 1; // Increment the score if the answer is correct
      }
    });
    return score;
  };

  const renderQuizQuestions = () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Question {currentQuestionIndex + 1}
        </Typography>
        <Box mb={2}>
          <Typography variant="body1">{currentQuestion.text}</Typography> 
        </Box>
        {currentQuestion.image && (
          <Box mb={2}>
           <img src={currentQuestion.image} alt={`Question ${currentQuestionIndex + 1}`} style={{ maxWidth: '100%', maxHeight: '200px' }} />
 
          </Box>
        )}
        {currentQuestion.answers.map((answer, index) => (
          <FormControlLabel
            key={index}
            value={index}
            control={<Radio />}
            label={answer}
            checked={userAnswers[currentQuestionIndex] === index} // Check if the answer is selected by the user
            onChange={handleAnswerChange} // Handle the change of selected answer
          />
        ))}
        <Box mt={2}>
          <Button variant="contained" onClick={handleNextQuestion}>
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button> 
        </Box>
      </Box>
    );
  };

  const renderQuizSummary = () => {
    const score = calculateScore();

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Quiz Completed Summary
        </Typography>
        <Typography variant="body1" gutterBottom>
          Score: {score}/{quiz.questions.length}
        </Typography> 
        <Typography variant="body1" gutterBottom>
          Questions:
        </Typography>
        <ul>
          {quiz.questions.map((question, index) => (
            <li key={index}>
              {question.text} - Correct Answer: {question.answers[question.correctAnswerIndex]}
            </li>
          ))} 
        </ul>
        <Box mt={2}>
          <Button variant="contained" onClick={handleBackToQuizList}>
            Back to Quiz List
          </Button> 
        </Box>
      </Box>
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
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxWidth: 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 2,
              outline: 'none',
            }}
          >
            {showSummary ? renderQuizSummary() : renderQuizQuestions()} 
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default QuizTaking;
