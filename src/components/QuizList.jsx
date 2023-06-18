import React from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';

function QuizList({ quizzes, onQuizSelected, onQuizDelete }) {
  return (
    <div>
      <h2>Quiz List</h2>
      {quizzes && quizzes.length > 0 ? ( // Check if there are quizzes available
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Quiz Title</TableCell> 
                <TableCell align="center">Actions</TableCell> 
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.map((quiz) => ( // Iterate over the quizzes and create a table row for each quiz
              // Display the quiz title in a table cell
                <TableRow key={quiz.id}>
                  <TableCell component="th" scope="row">
                    {quiz.title} 
                  </TableCell>
                  <TableCell align="center">
                    <Button variant="contained" onClick={() => onQuizSelected(quiz)}>
                      Take Quiz 
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => onQuizDelete(quiz.id)}>
                      Delete 
                    </Button>
                  </TableCell>
                </TableRow>
                // Display a button to take the quiz
                  // Display a button to delete the quiz
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No quizzes available.</p> // Display a message if there are no quizzes available
      )}
    </div>
  );
}

export default QuizList;
