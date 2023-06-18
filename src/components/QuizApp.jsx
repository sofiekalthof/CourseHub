import React, { useState } from 'react';
import QuizCreation from './QuizCreation';
import QuizList from './QuizList';
import QuizTaking from './QuizTaking';

function QuizApp() {
  const [quizzes, setQuizzes] = useState([]); // Store the list of quizzes
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Store the currently selected quiz

  const handleQuizSubmit = (quiz) => {
    setQuizzes((prevQuizzes) => [...prevQuizzes, quiz]); // Add the submitted quiz to the list of quizzes
  };

  const handleQuizSelected = (quiz) => {
    setSelectedQuiz(quiz); // Set the selected quiz to the one clicked by the user
  };

  const handleQuizDelete = (quizId) => {
    setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== quizId)); // Remove the quiz with the specified ID from the list of quizzes
    setSelectedQuiz(null); // Deselect the deleted quiz
  };

  const handleBackToQuizList = () => {
    setSelectedQuiz(null); // Set the selected quiz to null to go back to the quiz list view
  };

  return (
    <div>
      <h1>Quiz App</h1>
      <QuizCreation onQuizCreated={handleQuizSubmit} /> 

      <QuizList quizzes={quizzes} onQuizSelected={handleQuizSelected} onQuizDelete={handleQuizDelete} />
      {/* Component for displaying the list of quizzes */}
      {/* Pass the list of quizzes, the function to handle quiz selection, and the function to handle quiz deletion */}

      {selectedQuiz && <QuizTaking quiz={selectedQuiz} onBackToQuizList={handleBackToQuizList} />}
      {/* Render the QuizTaking component only if a quiz is selected */}
      {/* Pass the selected quiz and the function to handle going back to the quiz list */}
    </div>
  );
}

export default QuizApp;
