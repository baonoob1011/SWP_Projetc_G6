import Forget from "./components/page/Forget.tsx";
import Login from "./components/page/Login.tsx";
import SignUp from "./components/page/SignUp.tsx";
import { Route, Routes } from "react-router-dom";
import Home from "./components/page/Home.tsx";
import { Header } from "./components/mainContents/Header.tsx";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Services from "./components/mainContents/services/Services.tsx";
import SignUpStaff from "./components/mainContents/feature/SignUpForStaff.tsx";
import SignUpManager from "./components/mainContents/feature/SignUpForManager.tsx";
import GetManagerByAdmin from "./components/mainContents/actorList/GetManagerByAdmin.tsx";
import GetStaffByAdmin from "./components/mainContents/actorList/GetStaffByAdmin.tsx";
import GetUserByAdmin from "./components/mainContents/actorList/GetUserByAdmin.tsx";
import GetUserByManager from "./components/mainContents/actorList/GetUserByManager.tsx";
import GetStaffByManager from "./components/mainContents/actorList/GetStaffByManager.tsx";
// import GetUserByStaff from "./components/mainContents/actorList/GetUserByStaff.tsx";
import Branch from "./components/page/Branch.tsx";
import Map from "./components/page/Map.tsx";


function App() {
  const [fullname, setFullName] = useState(localStorage.getItem("fullName") || "");

  return (
    <>
      
      

      {/* <GetUserByStaff/> */}
      <Header fullName={fullname} setFullName={setFullName} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setFullName={setFullName} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/branch" element={<Branch />} />
        <Route path="/signup-manager" element={<SignUpManager />} />
        <Route path="/signup-staff" element={<SignUpStaff />} />
        <Route path="/map" element={<Map />} />
        <Route path="/managerData" element={<GetManagerByAdmin/>} />
        <Route path="/staffData" element={<GetStaffByAdmin/>} />
        <Route path="/userData" element={<GetUserByAdmin/>} />
        <Route path="/m-userData" element={<GetUserByManager/>} />
        <Route path="/m-staffData" element={<GetStaffByManager/>} />
        <Route path="/create-services" element={<Services />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
