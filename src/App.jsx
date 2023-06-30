import React from 'react';
import UserPage from './components/UserPage';
import Navbar from './components/Navbar';
import QuizApp from './components/QuizApp';

function App() {
  return (
    <div>
      <Navbar/>
      <UserPage />
      <QuizApp />
    </div>
  );
}

export default App;
