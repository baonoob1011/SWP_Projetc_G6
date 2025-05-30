import "./App.css";
import Forget from "./components/page/Forget.tsx";
import Login from "./components/page/Login.tsx";
import SignUp from "./components/page/SignUp.tsx";
import { Route, Routes } from "react-router-dom";
import Home from "./components/page/Home.tsx";
import { Header } from "./components/mainContents/Header.tsx";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [fullname, setFullName] = useState(localStorage.getItem("fullName") || "");

  return (
    <>
      <Header fullName={fullname} setFullName={setFullName} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setFullName={setFullName} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget" element={<Forget />} />
      </Routes>
      <ToastContainer/>
    </>
  );
}

export default App;
