import { Box, Button, Paper, TableContainer, Typography } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';

const DataList = () => {
  const linkStyle = {
    backgroundColor: '#f8faff',
    color: '#1565c0',
    border: '2px solid #e3f2fd',
    borderRadius: '12px',
    margin: '0 12px 12px 0',
    padding: '12px 24px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    minHeight: '48px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(21, 101, 192, 0.1)',
    '&:hover': {
      backgroundColor: '#e3f2fd',
      borderColor: '#1976d2',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(21, 101, 192, 0.2)',
    },
    '&.active': {
      backgroundColor: '#1976d2',
      color: 'white',
      borderColor: '#1976d2',
      boxShadow: '0 4px 16px rgba(25, 118, 210, 0.4)',
      transform: 'translateY(-1px)',
    },
  };

  const navigationItems = [
    { to: "/admin/user", label: "Danh sách người dùng" },
    { to: "/admin/manager", label: "Danh sách quản lý" },
    { to: "/admin/staff", label: "Danh sách nhân viên" },
    { to: "/admin/collector", label: "Danh sách nhân viên thu mẫu" },
    { to: "/admin/staff-at-home", label: "Danh sách nhân viên dịch vụ tại nhà" },
    { to: "/admin/cashier", label: "Danh sách nhân viên thu ngân" },
    { to: "/admin/technical", label: "Danh sách nhân viên phòng lab" },
    { to: "/admin/appointment", label: "Danh sách lịch hẹn" },
  ];

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(21, 101, 192, 0.1)',
        border: '1px solid #e3f2fd'
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          color: '#1565c0', 
          fontWeight: 700, 
          mb: 3,
          textAlign: 'center',
          fontSize: '24px'
        }}
      >
        Quản lý hệ thống
      </Typography>
      
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: 2,
        mb: 4
      }}>
        {navigationItems.map((item) => (
          <Button 
            key={item.to}
            component={NavLink} 
            to={item.to} 
            sx={linkStyle}
          >
            {item.label}
          </Button>
        ))}
      </Box>
      
      <Box sx={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e3f2fd',
        minHeight: '200px',
        boxShadow: '0 2px 8px rgba(21, 101, 192, 0.05)'
      }}>
        <Outlet />
      </Box>
    </TableContainer>
  );
};

export default DataList;

export const DataList2 = () => {
  const linkStyle = {
    backgroundColor: '#f8faff',
    color: '#1565c0',
    border: '2px solid #e3f2fd',
    borderRadius: '12px',
    margin: '0 12px 12px 0',
    padding: '12px 24px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    minHeight: '48px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(21, 101, 192, 0.1)',
    '&:hover': {
      backgroundColor: '#e3f2fd',
      borderColor: '#1976d2',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(21, 101, 192, 0.2)',
    },
    '&.active': {
      backgroundColor: '#1976d2',
      color: 'white',
      borderColor: '#1976d2',
      boxShadow: '0 4px 16px rgba(25, 118, 210, 0.4)',
      transform: 'translateY(-1px)',
    },
  };

  const navigationItems = [
    { to: "/manager/user", label: "Danh sách người dùng" },
    { to: "/manager/staff", label: "Danh sách nhân viên" },
  ];

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(21, 101, 192, 0.1)',
        border: '1px solid #e3f2fd'
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          color: '#1565c0', 
          fontWeight: 700, 
          mb: 3,
          textAlign: 'center',
          fontSize: '24px'
        }}
      >
        Quản lý người dùng
      </Typography>
      
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
        },
        gap: 2,
        mb: 4,
        justifyItems: 'center'
      }}>
        {navigationItems.map((item) => (
          <Button 
            key={item.to}
            component={NavLink} 
            to={item.to} 
            sx={{
              ...linkStyle,
              minWidth: '200px'
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
      
      <Box sx={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e3f2fd',
        minHeight: '200px',
        boxShadow: '0 2px 8px rgba(21, 101, 192, 0.05)'
      }}>
        <Outlet />
      </Box>
    </TableContainer>
  );
};