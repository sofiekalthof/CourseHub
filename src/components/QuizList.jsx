import React from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Typography,
  Box,
} from '@mui/material';

function QuizList({ quizzes, onQuizSelected, onQuizDelete }) {
  return (
    <Box mt={2}>
      <Typography variant="h4" gutterBottom>
        Quiz List
      </Typography>
      {quizzes && quizzes.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Quiz Title</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell component="th" scope="row">
                    {quiz.title}
                  </TableCell>
                  <TableCell align="center">
                    <Button variant="contained" onClick={() => onQuizSelected(quiz)}>
                      Take Quiz
                    </Button>
                    {/* <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => onQuizDelete(quiz.id)}
                    >
                      Delete
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" gutterBottom>
          No quizzes available.
        </Typography>
      )}
    </Box>
  );
}

export default QuizList;
