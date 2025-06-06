import Forget from "./components/page/Forget.tsx";
import Login from "./components/page/Login.tsx";
import SignUp from "./components/page/SignUp.tsx";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/page/Home.tsx";
import { Header } from "./components/mainContents/Header.tsx";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Services from "./components/mainContents/services/CreateServices.tsx";
import SignUpStaff from "./components/mainContents/feature/SignUpForStaff.tsx";
import SignUpManager from "./components/mainContents/feature/SignUpForManager.tsx";
import GetManagerByAdmin from "./components/mainContents/actorList/GetManagerByAdmin.tsx";
import GetStaffByAdmin from "./components/mainContents/actorList/GetStaffByAdmin.tsx";
import GetUserByAdmin from "./components/mainContents/actorList/GetUserByAdmin.tsx";
import GetUserByManager from "./components/mainContents/actorList/GetUserByManager.tsx";
import GetStaffByManager from "./components/mainContents/actorList/GetStaffByManager.tsx";
// import GetUserByStaff from "./components/mainContents/actorList/GetUserByStaff.tsx";
import Map from "./components/page/Map.tsx";
import AdminSidebar from "./components/page/AdminPage.tsx";
import { Box } from "@mui/material";
import DataList from "./components/mainContents/actorList/AllDataList.tsx";
import BookAppointmentForm from "./components/mainContents/services/SignUpServices.tsx";
import BranchAndMap from "./components/page/BranchAndMap.tsx";
// import NewPassWord from "./components/mainContents/actorList/ResetPassword.tsx";

function App() {
  const [fullname, setFullName] = useState(
    localStorage.getItem("fullName") || ""
  );

  const role = localStorage.getItem("role");
  const location = useLocation();
  const hideHeaderPaths = ["/login", "/signup", "/forget"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);
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
          <Box
            sx={{
              flexGrow: 1,
              p: 3,
              bgcolor: "#f9fafb",
              height: "100vh",
              overflowY: "auto",
              m: 0
            }}
          >
            <Routes>
              <Route path="/admin" element={<DataList />}>
                <Route path="data" />
                <Route path="manager" element={<GetManagerByAdmin />} />
                <Route path="staff" element={<GetStaffByAdmin />} />
                <Route path="user" element={<GetUserByAdmin />} />
              </Route>
              <Route path="signup-manager" element={<SignUpManager />} />
              <Route path="signup-staff" element={<SignUpManager />} />
              <Route path="services" element={<Services />} />
            </Routes>
          </Box>
        </Box>
      ) : (
        <>
          {!shouldHideHeader && (
            <Header fullName={fullname} setFullName={setFullName} />
          )}
          
          <Routes>


            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={<Login setFullName={setFullName} />}
            />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forget" element={<Forget />} />
            <Route path="/signup-staff" element={<SignUpStaff />} />
            <Route path="/branch-and-map" element={<BranchAndMap />} />
            <Route path="/map" element={<Map />} />
            <Route path="/m-userData" element={<GetUserByManager />} />
            <Route path="/m-staffData" element={<GetStaffByManager />} />
            <Route path="/create-services" element={<Services />} />
            <Route path="/order" element={<BookAppointmentForm />} />
          </Routes>
          <ToastContainer />
          {/* <NewPassWord /> */}
        </>
      )}
    </>
  );
}

export default App;
