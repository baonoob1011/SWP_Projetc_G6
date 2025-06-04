import Forget from "./components/page/Forget.tsx";
import Login from "./components/page/Login.tsx";
import SignUp from "./components/page/SignUp.tsx";
import { Route, Routes } from "react-router-dom";
import Home from "./components/page/Home.tsx";
// import { Header } from "./components/mainContents/Header.tsx";
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
import AdminSidebar from "./components/page/AdminPage.tsx";
import { Box } from "@mui/material";

function App() {
  const [fullname, setFullName] = useState(
    localStorage.getItem("fullName") || ""
  );

  const role = localStorage.getItem("role");

  return (
    <>
      {role === "ADMIN" ? (
        <Box sx={{ display: "flex", height: "100vh" }}>
          <Box
            sx={{
              width: 250,
              flexShrink: 0,
              height: "100vh",
              borderRight: "1px solid #ddd",
              bgcolor: "background.paper",
            }}
          >
            <AdminSidebar />
          </Box>

          {/* Content chính: chiếm còn lại, full height, scroll riêng */}
          <Box
            sx={{
              flexGrow: 1,
              p: 3,
              bgcolor: "#f9fafb",
              height: "100vh",
              overflowY: "auto",
            }}
          >
            <Routes>
              <Route path="/admin/manager" element={<GetManagerByAdmin />} />
              <Route path="/admin/staff" element={<GetStaffByAdmin />} />
              <Route path="/admin/user" element={<GetUserByAdmin />} />
              <Route path="/signup-manager" element={<SignUpManager />} />
            </Routes>
          </Box>
        </Box>
      ) : (
        <>
          {/* <Header fullName={fullname} setFullName={setFullName} /> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={<Login setFullName={setFullName} />}
            />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forget" element={<Forget />} />
            <Route path="/signup-staff" element={<SignUpStaff />} />
            <Route path="/branch" element={<Branch />} />
            <Route path="/map" element={<Map />} />
            <Route path="/m-userData" element={<GetUserByManager />} />
            <Route path="/m-staffData" element={<GetStaffByManager />} />
            <Route path="/create-services" element={<Services />} />
          </Routes>
          <ToastContainer />
        </>
      )}
    </>
  );
}

export default App;
