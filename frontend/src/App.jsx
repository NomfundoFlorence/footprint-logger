import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useState } from "react";
import "./App.css";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Logger from "./components/Logger";
import Dashboard from "./components/Dashboard";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logger" element={<Logger />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
