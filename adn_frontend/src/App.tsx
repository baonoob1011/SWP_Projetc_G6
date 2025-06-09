// App.tsx
import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/page/Login';
import SignUp from './components/page/SignUp';
import Forget from './components/page/Forget';
import Home from './components/page/Home';
import Services from './components/mainContents/services/CreateServices';
import SignUpStaff from './components/mainContents/feature/SignUpForStaff';
import SignUpManager from './components/mainContents/feature/SignUpForManager';
import GetManagerByAdmin from './components/mainContents/actorList/GetManagerByAdmin';
import GetStaffByAdmin from './components/mainContents/actorList/GetStaffByAdmin';
import GetUserByAdmin from './components/mainContents/actorList/GetUserByAdmin';
import GetUserByManager from './components/mainContents/actorList/GetUserByManager';
import GetStaffByManager from './components/mainContents/actorList/GetStaffByManager';
import Map from './components/page/Map';
import AdminSidebar from './components/page/AdminPage';
import DataList from './components/mainContents/actorList/AllDataList';
import BookAppointmentForm from './components/mainContents/services/SignUpServices';
import BranchAndMap from './components/page/BranchAndMap';
import { Header } from './components/mainContents/Header';
import OldPassWord from './components/mainContents/feature/OldPassword';
import NewProfile from './components/mainContents/actorList/StaffAndManagerProfile';
import NewUserProfile from './components/mainContents/actorList/UserProfile';
import CivilServiceList from './components/mainContents/services/GetCivilService';
import AdministrativeServiceList from './components/mainContents/services/GetAdmintrativeService';
import ServiceList from './components/mainContents/services/GetService';
import StaffSchedule from './components/mainContents/actorList/StaffSchedule';
import GetUserByStaff from './components/mainContents/actorList/GetUserByStaff';

import Blog from './components/page/Blog';
import ProtectedRoute from './components/mainContents/feature/ProtectedRoute';

function App() {
  const [fullname, setFullName] = useState(
    localStorage.getItem('fullName') || ''
  );
  const role = localStorage.getItem('role');
  const location = useLocation();

  const hideHeaderPaths = ['/login', '/signup', '/forget'];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {role === 'ADMIN' ? (
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <Box sx={{ display: 'flex', height: '100vh' }}>
            <Box
              sx={{
                width: 250,
                flexShrink: 0,
                height: '100vh',
                borderRight: '1px solid #ddd',
                bgcolor: 'background.paper',
              }}
            >
              <AdminSidebar />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                p: 3,
                bgcolor: '#f9fafb',
                height: '100vh',
                overflowY: 'auto',
                m: 0,
              }}
            >
              <Routes>
                <Route path="/admin" element={<DataList />}>
                  <Route path="data" />
                  <Route path="manager" element={<GetManagerByAdmin />} />
                  <Route path="staff" element={<GetStaffByAdmin />} />
                  <Route path="user" element={<GetUserByAdmin />} />
                </Route>
                <Route path="/signup-manager" element={<SignUpManager />} />
                <Route path="/signup-staff" element={<SignUpStaff />} />
                <Route path="/services" element={<Services />} />
                <Route path="/a-getAllService" element={<ServiceList />} />
                <Route path="/s-slot/:staffId" element={<StaffSchedule />} />
              </Routes>
            </Box>
          </Box>
        </ProtectedRoute>
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

            <Route
              path="/change-pass"
              element={
                <ProtectedRoute allowedRoles={['USER', 'MANAGER', 'STAFF']}>
                  <OldPassWord role={role as 'USER' | 'STAFF' | 'MANAGER'} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order"
              element={
                <ProtectedRoute allowedRoles={['USER', 'MANAGER', 'STAFF']}>
                  <BookAppointmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/u-profile"
              element={
                <ProtectedRoute allowedRoles={['USER', 'MANAGER', 'STAFF']}>
                  <NewUserProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/m-userData"
              element={
                <ProtectedRoute allowedRoles={['MANAGER']}>
                  <GetUserByManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/m-staffData"
              element={
                <ProtectedRoute allowedRoles={['MANAGER']}>
                  <GetStaffByManager />
                </ProtectedRoute>
              }
            />

            <Route
              path="/s-userData"
              element={
                <ProtectedRoute allowedRoles={['STAFF']}>
                  <GetUserByStaff />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-services"
              element={
                <ProtectedRoute allowedRoles={['STAFF', 'MANAGER']}>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/s-m-profile"
              element={
                <ProtectedRoute allowedRoles={['STAFF', 'MANAGER']}>
                  <NewProfile role={role as 'STAFF' | 'MANAGER'} />
                </ProtectedRoute>
              }
            />
            <Route path="/service/civil" element={<CivilServiceList />} />

            <Route path="/blog" element={<Blog />} />

            <Route
              path="/service/administrative"
              element={<AdministrativeServiceList />}
            />
            <Route path="/m-getAllService" element={<ServiceList />} />
          </Routes>
          <ToastContainer />
        </>
      )}
    </>
  );
}

export default App;
