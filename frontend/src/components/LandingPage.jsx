import Login from "./Login";
import Register from "./Register";
import Welcome from "./Welcome";
// import context
import { useContext } from "react";
import { CompToLoad } from "../App";

// function to return component to load
function renderSwitch(str) {
  switch (str) {
    case "Welcome":
      return <Welcome></Welcome>;
    case "Register":
      return <Register></Register>;
    case "LogIn":
      return <Login></Login>;
    default:
      return <Welcome></Welcome>;
  }
}

export default function LandingPage() {
  // using context
  const compProvider = useContext(CompToLoad);

  return <>{renderSwitch(compProvider.comp)}</>;
}
