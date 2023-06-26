import React, { useState } from "react";
import QuizCreation from "./QuizCreation";
import QuizList from "./QuizList";
import QuizTaking from "./QuizTaking";
import AssignmentCreation from "./AssignmentCreation";
import AssignmentList from "./AssignmentList";
import AssignmentTaking from "./AssignmentTaking";

function QuizApp() {
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleQuizSubmit = (quiz) => {
    setQuizzes((prevQuizzes) => [...prevQuizzes, quiz]);
  };

  const handleAssignmentSubmit = (assignment) => {
    setAssignments((prevAssignments) => [...prevAssignments, assignment]);
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleAssignmentSelect = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleQuizDelete = (quizId) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.filter((quiz) => quiz.id !== quizId)
    );
  };

  const handleAssignmentDelete = (assignmentId) => {
    setAssignments((prevAssignments) =>
      prevAssignments.filter((assignment) => assignment.id !== assignmentId)
    );
  };

  const handleBackToQuizList = () => {
    setSelectedQuiz(null);
  };

  const handleBackToAssignmentList = () => {
    setSelectedAssignment(null);
  };

  return (
    <div>
      {selectedQuiz ? (
        <QuizTaking
          quiz={selectedQuiz}
          onBackToQuizList={handleBackToQuizList}
        />
      ) : selectedAssignment ? (
        <AssignmentTaking
          assignment={selectedAssignment}
          onBackToAssignmentList={handleBackToAssignmentList}
        />
      ) : (
        <div>
          <QuizCreation
            onSubmit={handleQuizSubmit}
            onQuizCreated={handleQuizSubmit}
          />
          <QuizList
            quizzes={quizzes}
            onQuizSelected={handleQuizSelect}
            onQuizDelete={handleQuizDelete}
          />
          <AssignmentCreation
            onSubmit={handleAssignmentSubmit}
            onAssignmentCreated={handleAssignmentSubmit}
          />
          <AssignmentList
            assignments={assignments}
            onAssignmentSelected={handleAssignmentSelect}
            onAssignmentDelete={handleAssignmentDelete}
          />
        </div>
      )}
    </div>
  );
}

export default QuizApp;
