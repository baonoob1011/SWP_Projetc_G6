import "./App.css";
import Forget from "./components/mainContents/userinfor/Forget.tsx";
import Login from "./components/mainContents/userinfor/Login.tsx";
import SignUp from "./components/mainContents/userinfor/SignUp.tsx";
import { Route, Routes } from "react-router-dom";
import Home from "./components/page/Home.tsx";
import { Header } from "./components/mainContents/Header.tsx";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  return (
    <>
      <Header username={username} setUsername={setUsername} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUsername={setUsername} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget" element={<Forget />} />
      </Routes>
      <ToastContainer/>
    </>
  );
}

export default App;
