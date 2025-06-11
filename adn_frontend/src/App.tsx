import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import Map from './components/page/Map';
import Blog from './components/page/Blog';
import AdminSidebar from './components/page/AdminPage';
import StaffPage from './components/page/StaffPage';
import ManagerPage from './components/page/ManagerPage';
import BranchAndMap from './components/page/BranchAndMap';

import Home from './components/page/Home';

import { Header } from './components/mainContents/Header';
import ProtectedRoute from './components/mainContents/feature/ProtectedRoute';
import OldPassWord from './components/mainContents/feature/OldPassword';
import CreateLocation from './components/mainContents/feature/CreateLocation';
import PatientRequest from './components/mainContents/feature/PatientRequest';
import GetSlot from './components/mainContents/feature/GetSlot';

import DataList, {
  DataList2,
} from './components/mainContents/actorList/AllDataList';
import GetUserByStaff from './components/mainContents/actorList/GetUserByStaff';
import GetManagerByAdmin from './components/mainContents/actorList/GetManagerByAdmin';
import GetStaffByAdmin from './components/mainContents/actorList/GetStaffByAdmin';
import GetUserByAdmin from './components/mainContents/actorList/GetUserByAdmin';
import GetStaffByManager from './components/mainContents/actorList/GetStaffByManager';
import GetUserByManager from './components/mainContents/actorList/GetUserByManager';

import NewProfile from './components/mainContents/actorList/StaffAndManagerProfile';
import NewUserProfile from './components/mainContents/actorList/UserProfile';
import StaffSlot from './components/mainContents/actorList/StaffShedule';
import SignUpStaffSchedule from './components/mainContents/actorList/SignUpStaffSchedule';

import CivilServiceList from './components/mainContents/services/GetCivilService';
import AdministrativeServiceList from './components/mainContents/services/GetAdmintrativeService';
import ServiceList from './components/mainContents/services/GetService';
import SignUpManager from './components/mainContents/feature/SignUpForManager';
import SignUpStaff from './components/mainContents/feature/SignUpForStaff';
import Services from './components/mainContents/services/CreateServices';
import SignUp from './components/page/SignUp';
import Forget from './components/page/Forget';
import Login from './components/page/Login';
import CreateRoom from './components/mainContents/feature/CreateRoom';

function App() {
  const [fullname, setFullName] = useState(
    localStorage.getItem('fullName') || ''
  );
  const role = localStorage.getItem('role');
  const location = useLocation();

  const hideHeaderPaths = ['/login', '/signup', '/forget'];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  const isStaffLayoutRoute = [
    '/s-page/s-userData',
    '/s-page/s-slot',
    '/s-page/create-services',
    '/s-page',
  ].includes(location.pathname);

  const isManagerLayoutRoute = [
    '/manager/data',
    '/manager/services',
    '/manager/create-services',
    '/manager/staff',
    '/manager/user',
    '/manager',
  ].includes(location.pathname);

  return (
    <>
      {/* ADMIN LAYOUT */}
      {role === 'ADMIN' ? (
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <Box
            sx={{
              width: 250,
              flexShrink: 0,
              borderRight: '1px solid #ddd',
              bgcolor: 'background.paper',
            }}
          >
            <AdminSidebar />
          </Box>
          <Box
            sx={{ flexGrow: 1, p: 3, bgcolor: '#f9fafb', overflowY: 'auto' }}
          >
            <Routes>
              <Route path="/admin" element={<DataList />}>
                <Route path="data" />
                <Route
                  path="manager"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <GetManagerByAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="staff"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <GetStaffByAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="user"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <GetUserByAdmin />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="/signup-manager"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SignUpManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup-staff"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SignUpStaff />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/location"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CreateLocation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/room"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CreateRoom />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/services"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Services />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/a-getAllService"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ServiceList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/s-slot/:staffId"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SignUpStaffSchedule />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ToastContainer />
          </Box>
        </Box>
      ) : isStaffLayoutRoute ? (
        // STAFF LAYOUT RIÊNG
        <Box sx={{ display: 'flex' }}>
          {/* Sidebar - Always visible */}
          <Box
            sx={{
              width: 250,
              height: '100vh',
              position: 'fixed',
              top: 0,
              left: 0,
              borderRight: '1px solid #ddd',
              bgcolor: 'background.paper',
              zIndex: 1000,
            }}
          >
            <ProtectedRoute allowedRoles={['STAFF']}>
              <StaffPage />
            </ProtectedRoute>
          </Box>

          {/* Main content area */}
          <Box
            sx={{
              flexGrow: 1,
              marginLeft: '250px', // 👈 để tránh bị đè lên Sidebar
              p: 3,
              bgcolor: '#f9fafb',
              height: '100vh',
              overflowY: 'auto',
            }}
          >
            <Routes>
              <Route
                path="/s-page/s-userData"
                element={
                  <ProtectedRoute allowedRoles={['STAFF']}>
                    <GetUserByStaff />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/s-page/s-slot"
                element={
                  <ProtectedRoute allowedRoles={['STAFF']}>
                    <StaffSlot />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ToastContainer />
          </Box>
        </Box>
      ) : isManagerLayoutRoute ? (
        // STAFF LAYOUT RIÊNG
        <Box sx={{ display: 'flex' }}>
          {/* Sidebar - Always visible */}
          <Box
            sx={{
              width: 250,
              height: '100vh',
              position: 'fixed',
              top: 0,
              left: 0,
              borderRight: '1px solid #ddd',
              bgcolor: 'background.paper',
              zIndex: 1000,
            }}
          >
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <ManagerPage />
            </ProtectedRoute>
          </Box>

          {/* Main content area */}
          <Box
            sx={{
              flexGrow: 1,
              marginLeft: '250px', // 👈 để tránh bị đè lên Sidebar
              p: 3,
              bgcolor: '#f9fafb',
              height: '100vh',
              overflowY: 'auto',
            }}
          >
            <Routes>
              <Route path="/manager" element={<DataList2 />}>
                <Route path="data" />
                <Route
                  path="staff"
                  element={
                    <ProtectedRoute allowedRoles={['MANAGER']}>
                      <GetStaffByManager />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="user"
                  element={
                    <ProtectedRoute allowedRoles={['MANAGER']}>
                      <GetUserByManager />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="manager/services"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <ServiceList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manager/create-services"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <Services />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ToastContainer />
          </Box>
        </Box>
      ) : (
        // LAYOUT MẶC ĐỊNH
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
            <Route path="/branch-and-map" element={<BranchAndMap />} />
            <Route path="/map" element={<Map />} />
            <Route path="/blog" element={<Blog />} />

            {/* USER, STAFF, MANAGER DÙNG DEFAULT */}
            <Route
              path="/change-pass"
              element={
                <ProtectedRoute allowedRoles={['USER', 'MANAGER', 'STAFF']}>
                  <OldPassWord role={role as 'USER' | 'STAFF' | 'MANAGER'} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:serviceId"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <GetSlot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <PatientRequest />
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

            {/* MANAGER */}

            <Route
              path="/m-getAllService"
              element={
                <ProtectedRoute allowedRoles={['MANAGER']}>
                  <ServiceList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/service/civil"
              element={
                <ProtectedRoute>
                  <CivilServiceList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/service/administrative"
              element={
                <ProtectedRoute>
                  <AdministrativeServiceList />
                </ProtectedRoute>
              }
            />

            {/* STAFF + MANAGER */}

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
