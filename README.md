# CourseHub
<p align="center">
  <img height="250px" src="https://github.com/sofiekalthof/CourseHub/assets/82824083/bbc9ee2f-2ef8-42ca-8254-fac1c39efdaa">
</p>


## Project Idea
- Learning Management System (LMS) 
- Motivating users to learn
- Track progress of learning with timeline
- See activity in one course and compare to other users
- Create/Take quizzes and assignments

## Project Structure

- ### Landing Page
  - Introduces user into website
  - List of features of website

<p align="center">
  <img height="250px" src="https://github.com/sofiekalthof/CourseHub/assets/82824083/5925232e-7873-4381-b521-ca7f8740046f">
</p>

- ### Register Login Page
  - Registration of new users
  - Login for existing users

<p align="center">
  <img height="250px" src="https://github.com/sofiekalthof/CourseHub/assets/82824083/a1438668-99ca-4d40-a7b2-b11d30cd396b">
</p>

- ### Home Page
  - List of all courses and their description available on CourseHub
  - Searchbar to search for courses
  - Create new courses

<p align="center">
  <img height="250px" src="https://github.com/sofiekalthof/CourseHub/assets/82824083/4f0a27de-98b7-4539-a894-3f2fe53b3468">
</p>


- ### Course Page
  Consists of two subpages:
  
  - #### General View
    - Timeline of the course (milestones/tasks)
    - Create new milestones
    - List of tasks (assignments/quizzes)
    - Create new tasks
    - Take tasks
    
<p align="center">
  <img height="250px" src="https://github.com/sofiekalthof/CourseHub/assets/82824083/117d2f98-39a3-451d-b133-16914da4ca7f">
</p>


 - #### Analytics:
    - Chart for users' activity 
    - Leaderboard
      
<p align="center">
  <img height="250px" src="https://github.com/sofiekalthof/CourseHub/assets/82824083/29fc9f68-d27e-4dbe-b336-e55d51eaf7c2">
</p>  

## How to run
Download and install [NodeJS](https://nodejs.org/de/download/)
- ### How to run backend
  1. Navigate into backend folder: 
  ```
  $ cd backend
  ```
  2. Install dependencies of the backend using npm: 
  ```
  $ npm install
  ```
  3. Run backend server using nodemon:
  ```
  $ nodemon src/server
  ```
  4. Open `http://localhost:3600` to view it in the browser.

- ### How to run frontend
  1. Navigate into frontend folder: 
  ```
  $ cd frontend
  ```
  2. Install dependencies of the frontend using npm: 
  ```
  $ npm install
  ```
  3. Run frontend using npm:
  ```
  $ npm run dev
  ```
  4. Open `http://localhost:5173` to view it in the browser (best working with Chrome)

## How to deploy
- ### Deploy backend
- ### Deploy frontend

## Technical architecture
- MERN technology stack:
  - MongoDB (with Mongoose)
  - Express
  - React
  - Node.js

- Client-server architecture
  - Database (Mongo DB)
  - Backend server (Express + Node.js)
  - Frontend server (React)

## Technologies
- [MongoDB](https://www.npmjs.com/package/mongodb)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [Express](https://www.npmjs.com/package/express)
- [express-sessions](https://www.npmjs.com/package/express-session)
- [connect-mongodb-session](https://www.npmjs.com/package/connect-mongodb-session)
- [Multer](https://www.npmjs.com/package/multer)
- [FS](https://www.npmjs.com/package/fs)
- [NodeJS](https://nodejs.org/de/download/)
- [React](https://reactjs.org/docs/getting-started.html)
- [Material UI](https://material-ui.com/getting-started/installation/)
- [ApexCharts](https://apexcharts.com/docs/react-charts/)

## Links
- [Advertisement Video](https://youtu.be/4Y8YGkVlAvQ)
- [Live Demo](https://youtu.be/w5ySgMsMuqw)
- [Deployed Backend](https://backendtest-juq7.onrender.com/)
- [Deployed Frontend](https://guileless-souffle-4833ce.netlify.app/)

## Group members
- [Mahsa Alavi](https://github.com/mhsalavi)
- [Utku Karadeniz](https://github.com/blocksea)
- [Sofie Kalthof](https://github.com/sofiekalthof)
