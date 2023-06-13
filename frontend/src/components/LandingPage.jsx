import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Button from "@mui/material/Button";

export default function LandingPage() {
  const [toDisplay, setToDisplay] = useState("Register");

  return (
    <>
      <Button
        onClick={() => setToDisplay("Register")}
        fullWidth
        variant="contained"
      >
        Register
      </Button>
      <Button
        onClick={() => setToDisplay("Sign-In")}
        fullWidth
        variant="contained"
      >
        Log-In
      </Button>

      {toDisplay === "Register" ? <Register /> : <Login />}
    </>
  );
}
