import CoursePage from "./components/CoursePage"
import HomePage from "./components/HomePage"
import { Route, Routes } from "react-router-dom";



function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/course' element={<CoursePage/>}/>
    </Routes>



    </>
  )
}

export default App
