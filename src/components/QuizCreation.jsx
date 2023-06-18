import React, { useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

function QuizCreation({ onQuizCreated }) {
  // State variables
  const [open, setOpen] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    { id: uuidv4(), text: '', answers: ['', '', '', ''], correctAnswerIndices: [], image: null },
  ]);
  const [error, setError] = useState('');

  // Function to open the dialog
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Function to handle quiz title change
  const handleQuizTitleChange = (event) => {
    setQuizTitle(event.target.value);
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
          updatedIndices = updatedIndices.filter((index) => index !== answerIndex);
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
      text: '',
      answers: ['', '', '', ''],
      correctAnswerIndices: [],
      image: null,
    };
    setQuestions([...questions, newQuestion]);
  };

  // Function to remove a question
  const removeQuestion = (questionId) => {
    // Filter out the question with the specified ID
    const updatedQuestions = questions.filter((question) => question.id !== questionId);
    setQuestions(updatedQuestions);
  };

  // Function to handle quiz creation
  const handleCreateQuiz = () => {
    // Validate quiz data before creating
    if (quizTitle.trim() === '') {
      setError('Please enter a quiz title');
      return;
    }

    for (const question of questions) {
      if (question.text.trim() === '') {
        setError('Please fill in all the question fields');
        return;
      }
      if (question.correctAnswerIndices.length === 0) {
        setError('Please select at least one correct answer for each question');
        return;
      }
    }

    // Create the quiz object
    const quiz = {
      title: quizTitle,
      questions: questions.map(({ id, text, answers, correctAnswerIndices, image }) => ({
        id,
        text,
        answers,
        correctAnswerIndices,
        image,
      })),
    };

    // Pass the created quiz to the parent component
    onQuizCreated(quiz);

    // Reset form fields and error
    setQuizTitle('');
    setQuestions([{ id: uuidv4(), text: '', answers: ['', '', '', ''], correctAnswerIndices: [], image: null }]);
    setError('');

    // Close the dialog
    handleClose();
  };

  // JSX components for the dialog and form
  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Quiz
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Quiz</DialogTitle>
        <DialogContent dividers>
          {error && (
            <Typography variant="body1" color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <TextField
            label="Quiz Title"
            value={quizTitle}
            onChange={handleQuizTitleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            {questions.map((question) => (
              <Grid item xs={12} key={question.id}>
                <Box
                  sx={{
                    border: 1,
                    p: 2,
                    mb: 2,
                    maxHeight: '300px',
                    overflow: 'auto',
                  }}
                >
                  <TextField
                    label="Question"
                    value={question.text}
                    onChange={(event) => handleQuestionTextChange(event.target.value, question.id)}
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
                            handleAnswerTextChange(event, question.id, answerIndex)
                          }
                          fullWidth
                          sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={question.correctAnswerIndices.includes(answerIndex)}
                              onChange={(event) =>
                                handleCorrectAnswerChange(event, question.id, answerIndex)
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
                    onChange={(event) => handleQuestionFileChange(event, question.id)}
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateQuiz} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default QuizCreation;
