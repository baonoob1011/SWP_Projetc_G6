// src/components/mainContents/Header.tsx

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Menu,
  MenuItem,
  ListItemButton,
} from '@mui/material';

import {
  Menu as MenuIcon,
  ArrowDropDown,
  AccountCircle,
} from '@mui/icons-material';

import { NavLink, useNavigate } from 'react-router-dom';

import logo from '../../image/Logo.png';

type HeaderProps = {
  fullName: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
};

export function Header({ fullName, setFullName }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const navItems = [
    { label: 'Trang chủ', path: '/' },
    {
      label: 'Dịch vụ',
      children: [
        { label: 'Hành chính', path: '/service/administrative' },
        { label: 'Dân sự', path: '/service/civil' },
      ],
    },
    { label: 'Tin tức', path: '/blog' },
    { label: 'Địa chỉ', path: '/branch-and-map' },
  ];

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    label: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(label);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(null);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await fetch('http://localhost:8080/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('fullName');
      localStorage.removeItem('role');
      setFullName('');
      navigate('/login');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout API error:', error);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            px: { xs: 2, md: 4 },
            minHeight: { xs: 64, md: 100 },
            height: { xs: 64, md: 100 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              minWidth: 280,
            }}
          >
            <NavLink
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                gap: 12,
              }}
            >
              <img
                src={logo}
                alt="GenLink Logo"
                style={{
                  height: 200,
                  width: 'auto',
                }}
              />
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
               
              </Box>
            </NavLink>
          </Box>

          {/* Navigation Menu */}
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              gap: '30px',
              mx: 2,
            }}
          >
            {navItems.map((item) =>
              item.children ? (
                <Box key={item.label} sx={{ position: 'relative' }}>
                  <Button
                    endIcon={<ArrowDropDown />}
                    onClick={(e) => handleOpenMenu(e, item.label)}
                    sx={{
                      textTransform: 'none',
                      px: 2,
                      py: 1,
                      fontSize: 20,
                      fontWeight: 500,
                      color: '#333',
                      minWidth: 'auto',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        color: '#1976d2',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuOpen === item.label}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                    MenuListProps={{ sx: { py: 1 } }}
                  >
                    {item.children!.map((child) => (
                      <MenuItem
                        key={child.label}
                        component={NavLink}
                        to={child.path}
                        onClick={handleCloseMenu}
                        sx={{
                          px: 3,
                          py: 1.5,
                          fontSize: 20,
                          color: '#333',
                          fontWeight: 400,
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                            color: '#1976d2',
                          },
                        }}
                      >
                        {child.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <Button
                  key={item.label}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    fontSize: 20,
                    fontWeight: 500,
                    color: '#333',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      color: '#1976d2',
                    },
                    '&.active': {
                      color: '#1976d2',
                      fontWeight: 600,
                    },
                  }}
                >
                  {item.label}
                </Button>
              )
            )}
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              minWidth: 200,
              justifyContent: 'flex-end',
            }}
          >

            {/* User Menu or Auth Buttons */}
            {fullName ? (
              role === 'MANAGER' ? (
                <>
                  <Button
                    onClick={(e) => handleOpenMenu(e, 'MANAGER')}
                    endIcon={<ArrowDropDown />}
                    sx={{
                      textTransform: 'none',
                      px: 2,
                      py: 1,
                      fontSize: 20,
                      fontWeight: 500,
                      color: '#333',
                      minWidth: 'auto',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    {fullName}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuOpen === 'MANAGER'}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                    MenuListProps={{ sx: { py: 1 } }}
                  >
                    <MenuItem
                      component={NavLink}
                      to="/manager"
                      onClick={handleCloseMenu}
                      sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: 20,
                        color: '#333',
                        fontWeight: 400,
                        '&:hover': { backgroundColor: '#f5f5f5' },
                      }}
                    >
                      Trang làm việc
                    </MenuItem>
                    <MenuItem
                      component={NavLink}
                      to="/s-m-profile"
                      onClick={handleCloseMenu}
                      sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: 20,
                        color: '#333',
                        fontWeight: 400,
                        '&:hover': { backgroundColor: '#f5f5f5' },
                      }}
                    >
                      Xem thông tin
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseMenu();
                        handleLogout();
                      }}
                      sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: 20,
                        color: '#d32f2f',
                        fontWeight: 400,
                        '&:hover': { backgroundColor: '#ffebee' },
                      }}
                    >
                      Đăng xuất
                    </MenuItem>
                  </Menu>
                </>
              ) : role === 'STAFF' ? (
                <>
                  <Button
                    onClick={(e) => handleOpenMenu(e, 'STAFF')}
                    endIcon={<ArrowDropDown />}
                    sx={{
                      textTransform: 'none',
                      px: 2,
                      py: 1,
                      fontSize: 20,
                      fontWeight: 500,
                      color: '#333',
                      minWidth: 'auto',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    {fullName}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuOpen === 'STAFF'}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                    MenuListProps={{ sx: { py: 1 } }}
                  >
                    <MenuItem
                      component={NavLink}
                      to="/s-page"
                      onClick={handleCloseMenu}
                      sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: 20,
                        color: '#333',
                        fontWeight: 400,
                        '&:hover': { backgroundColor: '#f5f5f5' },
                      }}
                    >
                      Trang làm việc
                    </MenuItem>
                    <MenuItem
                      component={NavLink}
                      to="/s-m-profile"
                      onClick={handleCloseMenu}
                      sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: 20,
                        color: '#333',
                        fontWeight: 400,
                        '&:hover': { backgroundColor: '#f5f5f5' },
                      }}
                    >
                      Xem thông tin
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseMenu();
                        handleLogout();
                      }}
                      sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: 20,
                        color: '#d32f2f',
                        fontWeight: 400,
                        '&:hover': { backgroundColor: '#ffebee' },
                      }}
                    >
                      Đăng xuất
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    startIcon={<AccountCircle />}
                    onClick={(e) => handleOpenMenu(e, 'USER')}
                    endIcon={<ArrowDropDown />}
                    sx={{
                      textTransform: 'none',
                      px: 2,
                      py: 1,
                      fontSize: 20,
                      fontWeight: 500,
                      color: '#333',
                      minWidth: 'auto',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    {fullName}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuOpen === 'USER'}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                    MenuListProps={{ sx: { py: 1 } }}
                  >
                    <MenuItem
                      component={NavLink}
                      to="/u-profile"
                      onClick={handleCloseMenu}
                      sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: 20,
                        color: '#333',
                        fontWeight: 400,
                        '&:hover': { backgroundColor: '#f5f5f5' },
                      }}
                    >
                      Xem thông tin
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseMenu();
                        handleLogout();
                      }}
                      sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: 20,
                        color: '#d32f2f',
                        fontWeight: 400,
                        '&:hover': { backgroundColor: '#ffebee' },
                      }}
                    >
                      Đăng xuất
                    </MenuItem>
                  </Menu>
                </>
              )
            ) : (
              <>
                <Button
                  component={NavLink}
                  to="/login"
                  sx={{
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#1976d2',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  component={NavLink}
                  to="/signup"
                  sx={{
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'white',
                    backgroundColor: '#1976d2',
                    borderRadius: '6px',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                  }}
                >
                  Đăng ký
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              sx={{
                display: { lg: 'none' },
                color: '#333',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: '#ffffff',
          },
        }}
      >
        <Box sx={{ width: 280, pt: 2 }} role="presentation">
          <List sx={{ px: 2 }}>
            {navItems.map((item) =>
              item.children ? (
                <React.Fragment key={item.label}>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: '#1976d2',
                            fontSize: '1rem',
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {item.children.map((child) => (
                    <ListItem key={child.label} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        component={NavLink}
                        to={child.path}
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                          pl: 3,
                          py: 1.5,
                          borderRadius: '8px',
                          mb: 0.5,
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                color: '#333',
                                fontWeight: 400,
                                fontSize: '0.9rem',
                              }}
                            >
                              {child.label}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </React.Fragment>
              ) : (
                <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      py: 1.5,
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            color: '#333',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )
            )}
            {fullName && (
              <ListItem disablePadding sx={{ mt: 2 }}>
                <ListItemButton
                  onClick={() => {
                    setDrawerOpen(false);
                    handleLogout();
                  }}
                  sx={{
                    py: 1.5,
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#ffebee',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          color: '#d32f2f',
                          fontWeight: 500,
                          fontSize: 20,
                        }}
                      >
                        Đăng xuất
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}