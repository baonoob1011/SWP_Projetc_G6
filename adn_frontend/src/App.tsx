import { useState } from 'react';
import { Routes, Route, useLocation, matchPath } from 'react-router-dom';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';

// Trang chính
import Home from './components/page/Home';
import Blog from './components/page/Blog';
import Map from './components/page/Map';
import SignUp from './components/page/SignUp';
import Forget from './components/page/Forget';
import Login from './components/page/Login';

// Layout chung
import { Header } from './components/mainContents/Header';
import AdminSidebar from './components/page/AdminPage';
import StaffPage from './components/page/StaffPage';
import ManagerPage from './components/page/ManagerPage';
import BranchAndMap from './components/page/BranchAndMap';

// Route được bảo vệ và chức năng phụ
import ProtectedRoute from './components/mainContents/feature/ProtectedRoute';
import OldPassWord from './components/mainContents/feature/OldPassword';
import CreateLocation from './components/mainContents/feature/CreateLocation';
import CreateRoom from './components/mainContents/feature/CreateRoom';
import CreateKit from './components/mainContents/feature/CreateKit';
import CreateLocus from './components/mainContents/feature/CreateLocus';
import Rating from './components/page/Rating';

// Dữ liệu người dùng (User / Staff / Manager / Collector / Admin)
import DataList, {
  DataList2,
} from './components/mainContents/actorList/AllDataList';
import NewUserProfile from './components/mainContents/actorList/UserProfile';
import NewProfile from './components/mainContents/actorList/StaffAndManagerProfile';

import GetUserByAdmin from './components/mainContents/actorList/GetUserByAdmin';
import GetStaffByAdmin from './components/mainContents/actorList/GetStaffByAdmin';
import GetManagerByAdmin from './components/mainContents/actorList/GetManagerByAdmin';

import GetUserByStaff from './components/mainContents/actorList/GetUserByStaff';
import GetUserByManager from './components/mainContents/actorList/GetUserByManager';
import GetStaffByManager from './components/mainContents/actorList/GetStaffByManager';

// Đăng ký tài khoản
import SignUpManager from './components/mainContents/feature/SignUpForManager';
import SignUpStaff from './components/mainContents/feature/SignUpForStaff';
import SignUpStaffAtHome from './components/mainContents/actorList/staff/StaffAtHome';

// Quản lý lịch & Slot
import StaffSlot from './components/mainContents/actorList/staff/GetStaffSchedule';
import SignUpStaffSchedule from './components/mainContents/actorList/staff/SignUpStaffSchedule';

import AppointmentSchedule from './components/mainContents/actorList/staff/AppointmentSchedule';

// Quản lý cuộc hẹn
import GetSampleInfo from './components/mainContents/actorList/staff/GetSampleInfo';

// Quản lý dịch vụ & kết quả
import Services from './components/mainContents/services/CreateServices';
import ServiceList from './components/mainContents/services/GetService';
import CivilServiceList from './components/mainContents/services/GetCivilService';
import AdministrativeServiceList from './components/mainContents/services/GetAdministrativeService';
import NewPrice from './components/mainContents/services/NewPrice';
import CreateResultAllele from './components/mainContents/actorList/staff/ResultAllele';

// Đăng ký dịch vụ
import BookingAtCenter from './components/mainContents/services/BookingAtCenter';
import BookingAtHome from './components/mainContents/services/BookingAtHome';

import { CheckAppointment } from './components/mainContents/actorList/staff/CheckAppointment';
import GetCollector from './components/mainContents/actorList/GetCollector';
import SignUpCollector from './components/mainContents/actorList/staff/SignUpCollector';
import CreateBlog from './components/mainContents/services/CreateBlog';

import PatientRequest from './components/mainContents/feature/PatientRequest';

// Thanh toán
import VNPayResult from './components/mainContents/feature/VNPAY';
import GetStaffAtHome from './components/mainContents/actorList/staff/GetStaffAtHome';
import GetAllResult from './components/mainContents/feature/GetAllResult';
import GetCashier from './components/mainContents/actorList/admin/GetAllCashier';
import SignUpCashier from './components/mainContents/actorList/staff/SignUpCashier';
import GetAllBill from './components/mainContents/actorList/staff/GetAllBill';
import CreateDiscount from './components/mainContents/actorList/admin/CreateDiscount';
import SelectedCivilService from './components/mainContents/services/SelectedCivilService';
import SelectedAdministrativeService from './components/mainContents/services/SelectedAdministrativeService';
import { DashBoard } from './components/mainContents/actorList/admin/dashboard/Dashboard';

// import ChatComponent from './components/page/Messenger';

import GetStaffTechnical from './components/mainContents/actorList/staff/GetStaffTechnical';
import SignUpStaffTechnical from './components/mainContents/actorList/staff/SignUpStaffTechnical';
import GetBlogById from './components/mainContents/actorList/user/GetBlogById';
import { LabCheckSample } from './components/mainContents/actorList/staff/LabCheckSample';
import CollectSampleAtCenter from './components/mainContents/actorList/staff/CollectSampleAtCenter';
import GetConsultationStaff from './components/mainContents/actorList/GetConsultationStaff';
import SignUpConsultation from './components/mainContents/actorList/staff/SignUpConsultation';
import GetConsultant from './components/mainContents/actorList/staff/ConsultantPage';
import { CollectSampleAtHome } from './components/mainContents/actorList/staff/CollectSampleAtHome';
import Deposit from './components/mainContents/services/Deposit';
import CheckResult from './components/mainContents/actorList/manager/CheckResult';
import GetAllResultByManager from './components/mainContents/actorList/manager/GetAppointmentResult';
// import CreateBlog from './components/mainContents/services/CreateBlog';

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
    '/s-page/checkBooking',
    '/s-page/checkAppointmentAtCenter/:slotId',
    '/s-page/checkAppointmentAtHome/:appointmentId',
    '/s-page/get-appointment/:appointmentId',
    '/s-page/selectorSlot',
    '/s-page/labCheckSample',
    '/s-page/record-result/:sampleId',
    '/s-page',
  ].some((path) => matchPath(path, location.pathname));

  const isManagerLayoutRoute = [
    '/manager/data',
    '/manager/services',
    '/manager/checkResult',
    '/manager/create-services',
    '/manager/staff',
    '/manager/user',
    '/manager/collector',
    '/manager/technical',
    '/manager/staff-at-home',
    '/manager/consultant',
    '/manager/cashier',
    '/manager/createKit',
    '/manager/location',
    '/manager/room',
    '/manager/create-blog',
    '/schedule',
    'slot/:staffId',
    '/manager/create-locus',
    '/newPrice/:serviceId',
    '/manager',
    '/discount/:serviceId',
    '/signup-collector',
    '/signup-staff',
    '/signup-staff-technical',
    '/signup-consultant',
    '/signup-staff-at-home',
    '/signup-cashier',
    '/checkResultById/:appointmentId',
  ].some((path) => matchPath(path, location.pathname));

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
                <Route
                  path="collector"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <GetCollector />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="technical"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <GetStaffTechnical />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="staff-at-home"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <GetStaffAtHome />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="consultant"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <GetConsultationStaff />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="cashier"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <GetCashier />
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
                path="/signup-staff-technical"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SignUpStaffTechnical />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup-consultant"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SignUpConsultation />
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
                path="/kit"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CreateKit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/discount/:serviceId"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CreateDiscount />
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
                path="/create-blog"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CreateBlog />
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
                path="/newPrice/:serviceId"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <NewPrice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SignUpStaffSchedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-locus"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CreateLocus />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup-collector"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SignUpCollector />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup-cashier"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SignUpCashier />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <DashBoard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup-staff-at-home"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SignUpStaffAtHome />
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
            <ProtectedRoute allowedRoles={['STAFF', 'LAB_TECHNICIAN']}>
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
              <Route
                path="/s-page/checkBooking"
                element={
                  <ProtectedRoute allowedRoles={['STAFF']}>
                    <AppointmentSchedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/s-page/record-result/:sampleId"
                element={
                  <ProtectedRoute allowedRoles={['LAB_TECHNICIAN', 'STAFF']}>
                    <CreateResultAllele />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/s-page/checkAppointmentAtCenter/:slotId"
                element={
                  <ProtectedRoute allowedRoles={['STAFF']}>
                    <CollectSampleAtCenter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/s-page/checkAppointmentAtHome/:appointmentId"
                element={
                  <ProtectedRoute allowedRoles={['STAFF']}>
                    <CollectSampleAtHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/s-page/get-appointment/:appointmentId"
                element={
                  <ProtectedRoute allowedRoles={['LAB_TECHNICIAN', 'STAFF']}>
                    <GetSampleInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/s-page/selectorSlot"
                element={
                  <ProtectedRoute allowedRoles={['STAFF']}>
                    <CheckAppointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/s-page/labCheckSample"
                element={
                  <ProtectedRoute allowedRoles={['LAB_TECHNICIAN']}>
                    <LabCheckSample />
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
                <Route
                  path="collector"
                  element={
                    <ProtectedRoute allowedRoles={['MANAGER']}>
                      <GetCollector />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="technical"
                  element={
                    <ProtectedRoute allowedRoles={['MANAGER']}>
                      <GetStaffTechnical />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="staff-at-home"
                  element={
                    <ProtectedRoute allowedRoles={['MANAGER']}>
                      <GetStaffAtHome />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="consultant"
                  element={
                    <ProtectedRoute allowedRoles={['MANAGER']}>
                      <GetConsultationStaff />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="cashier"
                  element={
                    <ProtectedRoute allowedRoles={['MANAGER']}>
                      <GetCashier />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="/signup-staff"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <SignUpStaff />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup-staff-technical"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <SignUpStaffTechnical />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup-consultant"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <SignUpConsultation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup-collector"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <SignUpCollector />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup-cashier"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <SignUpCashier />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup-staff-at-home"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <SignUpStaffAtHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manager/checkResult"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <CheckResult />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manager/location"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <CreateLocation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manager/room"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <CreateRoom />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <SignUpStaffSchedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manager/services"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <ServiceList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/newPrice/:serviceId"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <NewPrice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manager/create-blog"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <CreateBlog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manager/createKit"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <CreateKit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkResultById/:appointmentId"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <GetAllResultByManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/discount/:serviceId"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <CreateDiscount />
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
              <Route
                path="slot/:staffId"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <SignUpStaffSchedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manager/create-locus"
                element={
                  <ProtectedRoute allowedRoles={['MANAGER']}>
                    <CreateLocus />
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
            <Route path="/blog-detail/:blogId" element={<GetBlogById />} />

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
              path="/order/at-center/:serviceId"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <BookingAtCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/at-home/:serviceId"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <BookingAtHome />
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
              path="/result/:appointmentId"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <GetAllResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="vnpay-payment/vnpay-payment"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <VNPayResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="vnpay-payment/wallet/vnpay-payment"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <Deposit />
                </ProtectedRoute>
              }
            />
            <Route
              path="feedback/:serviceId"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <Rating />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback/:serviceId"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <Rating />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/messenger"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <ChatComponent />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/u-profile"
              element={
                <ProtectedRoute allowedRoles={['USER', 'MANAGER', 'STAFF']}>
                  <NewUserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager-bill"
              element={
                <ProtectedRoute allowedRoles={['CASHIER']}>
                  <GetAllBill />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultation"
              element={
                <ProtectedRoute allowedRoles={['CONSULTANT']}>
                  <GetConsultant />
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
            <Route path="/service/civil" element={<CivilServiceList />} />
            <Route
              path="/service/administrative"
              element={<AdministrativeServiceList />}
            />

            {/* STAFF + MANAGER */}

            <Route
              path="/s-m-profile"
              element={
                <ProtectedRoute
                  allowedRoles={['STAFF', 'MANAGER', 'CASHIER', 'CONSULTANT']}
                >
                  <NewProfile
                    role={
                      role as 'STAFF' | 'MANAGER' | 'CASHIER' | 'CONSULTANT'
                    }
                  />
                </ProtectedRoute>
              }
            />

            <Route path="/service/civil" element={<CivilServiceList />} />

            <Route path="/blog" element={<Blog />} />

            <Route
              path="/service/administrative"
              element={<AdministrativeServiceList />}
            />
            <Route
              path="/order-civil/:serviceId"
              element={<SelectedCivilService />}
            />
            <Route
              path="/order-administrative/:serviceId"
              element={<SelectedAdministrativeService />}
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
