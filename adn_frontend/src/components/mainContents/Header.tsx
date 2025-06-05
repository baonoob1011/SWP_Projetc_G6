// src/components/mainContents/Header.tsx

import React, { useState } from "react";
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
} from "@mui/material";

import {
  Menu as MenuIcon,
  HomeOutlined,
  BuildOutlined,
  ArticleOutlined,
  CalendarTodayOutlined,
  BusinessOutlined,
  LocationOnOutlined,
  ArrowDropDown,
} from "@mui/icons-material";

import { NavLink, useNavigate } from "react-router-dom";



import logo from "../../image/Logo.png";
import styles from "./Header.module.css";

type HeaderProps = {
  fullName: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
};

export function Header({ fullName, setFullName }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const navItems = [
    { label: "Home", path: "/", icon: <HomeOutlined fontSize="small" /> },
    {
      label: "Dịch vụ",
      icon: <BuildOutlined fontSize="small" />,
      children: [
        { label: "Hành chính", path: "/service/administrative" },
        { label: "Dân sự", path: "/service/civil" },
      ],
    },
    { label: "Tin tức", path: "/blog", icon: <ArticleOutlined fontSize="small" /> },
    { label: "Đặt lịch", path: "/order", icon: <CalendarTodayOutlined fontSize="small" /> },
    { label: "Chi nhánh", path: "/branch", icon: <BusinessOutlined fontSize="small" /> },
    { label: "Địa chỉ", path: "/address", icon: <LocationOnOutlined fontSize="small" /> },
  ];

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, label: string) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(label);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(null);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await fetch("http://localhost:8080/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("fullName");
      localStorage.removeItem("role");
      setFullName("");
      navigate("/login");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout API error:", error);
    }
  };

  return (
    <>
      <AppBar position="fixed" color="inherit" elevation={1}>
        <Toolbar
          disableGutters
          sx={{
            px: 0,                // loại bỏ hoàn toàn padding ngang
            minHeight: "auto",    // bỏ chiều cao cố định 64px
            height: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo + GENLINK sát mép trái */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 0,   // margin-left = 0 để bám sát mép trái
            }}
          >
            <NavLink
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                marginLeft: 0,
              }}
            >
              <img
                src={logo}
                alt="Logo"
                className={styles.logoImage}
                style={{
                  width: 40,
                  height: 40,
                  display: "block",
                }}
              />
              <Typography
                variant="h6"
                component="div"
                className={styles.brandName}
                sx={{ ml: 0.5 }} // cách logo 4px
              >
                GENLINK
              </Typography>
            </NavLink>
          </Box>

          {/* Navigation giữa */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: 2,   // khoảng cách 16px giữa các nút
            }}
          >
            {navItems.map((item) =>
              item.children ? (
                <Box key={item.label} sx={{ position: "relative" }}>
                  <Button
                    className={styles.navButton}
                    startIcon={item.icon}
                    endIcon={<ArrowDropDown />}
                    onClick={(e) => handleOpenMenu(e, item.label)}
                    sx={{
                      textTransform: "none",
                      px: 1.5,  // padding ngang 12px
                    }}
                  >
                    {item.label}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuOpen === item.label}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    classes={{ paper: styles.menuPaper }}
                    MenuListProps={{ sx: { py: 0 } }}
                  >
                    {item.children!.map((child) => (
                      <MenuItem
                        key={child.label}
                        component={NavLink}
                        to={child.path}
                        onClick={handleCloseMenu}
                        className={styles.menuItem}
                        sx={{ px: 2, py: 1 }}
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
                  className={styles.navButton}
                  startIcon={item.icon}
                  sx={{
                    textTransform: "none",
                    px: 1.5,
                  }}
                >
                  {item.label}
                </Button>
              )
            )}
          </Box>

          {/* Phần Đăng nhập / Đăng ký sát mép phải */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5, // 12px giữa các nút
              pr: 0,    // padding-right = 0 để bám sát mép phải
            }}
          >
            {fullName ? (
              role === "MANAGER" ? (
                <>
                  <Button
                    className={styles.userButton}
                    onClick={(e) => handleOpenMenu(e, "MANAGER")}
                    endIcon={<ArrowDropDown />}
                    sx={{ textTransform: "none", px: 1.5 }}
                  >
                    {fullName}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuOpen === "MANAGER"}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    classes={{ paper: styles.menuPaper }}
                    MenuListProps={{ sx: { py: 0 } }}
                  >
                    <MenuItem
                      component={NavLink}
                      to="/signup-Staff"
                      onClick={handleCloseMenu}
                      className={styles.menuItem}
                      sx={{ px: 2, py: 1 }}
                    >
                      Đăng ký nhân viên
                    </MenuItem>
                    <MenuItem
                      component={NavLink}
                      to="/m-userData"
                      onClick={handleCloseMenu}
                      className={styles.menuItem}
                      sx={{ px: 2, py: 1 }}
                    >
                      Danh sách người dùng
                    </MenuItem>
                    <MenuItem
                      component={NavLink}
                      to="/m-staffData"
                      onClick={handleCloseMenu}
                      className={styles.menuItem}
                      sx={{ px: 2, py: 1 }}
                    >
                      Danh sách nhân viên
                    </MenuItem>
                    <MenuItem
                      component={NavLink}
                      to="/create-services"
                      onClick={handleCloseMenu}
                      className={styles.menuItem}
                      sx={{ px: 2, py: 1 }}
                    >
                      Tạo dịch vụ
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseMenu();
                        handleLogout();
                      }}
                      className={styles.menuItem}
                      sx={{ px: 2, py: 1 }}
                    >
                      Đăng xuất
                    </MenuItem>
                  </Menu>
                </>
              ) : role === "STAFF" ? (
                <>
                  <Button
                    className={styles.userButton}
                    onClick={(e) => handleOpenMenu(e, "STAFF")}
                    endIcon={<ArrowDropDown />}
                    sx={{ textTransform: "none", px: 1.5 }}
                  >
                    {fullName}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuOpen === "STAFF"}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    classes={{ paper: styles.menuPaper }}
                    MenuListProps={{ sx: { py: 0 } }}
                  >
                    <MenuItem
                      component={NavLink}
                      to="/signup-manager"
                      onClick={handleCloseMenu}
                      className={styles.menuItem}
                      sx={{ px: 2, py: 1 }}
                    >
                      Đăng ký quản lý
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseMenu();
                        handleLogout();
                      }}
                      className={styles.menuItem}
                      sx={{ px: 2, py: 1 }}
                    >
                      Đăng xuất
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Typography variant="body2">Welcome, {fullName}</Typography>
              )
            ) : (
              <>
                <Button
                  color="inherit"
                  component={NavLink}
                  to="/login"
                  className={styles.authButton}
                  sx={{ textTransform: "none", px: 1.5 }}
                >
                  Đăng nhập
                </Button>
                <Typography variant="body2" className={styles.divider}>
                  |
                </Typography>
                <Button
                  color="inherit"
                  component={NavLink}
                  to="/signup"
                  className={styles.authButton}
                  sx={{ textTransform: "none", px: 1.5 }}
                >
                  Đăng ký
                </Button>
              </>
            )}

            {/* Nút menu mobile (chỉ hiện khi < md) */}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              className={styles.menuIconButton}
              sx={{ display: { md: "none" } }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        classes={{ paper: styles.drawerPaper }}
      >
        <Box sx={{ width: 260 }} role="presentation">
          <List>
            {navItems.map((item) =>
              item.children ? (
                <React.Fragment key={item.label}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {item.icon}
                          <Typography variant="body1">{item.label}</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {item.children.map((child) => (
                    <ListItem key={child.label} disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to={child.path}
                        onClick={() => setDrawerOpen(false)}
                        className={styles.drawerItemButton}
                        sx={{ pl: 4 }}
                      >
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </React.Fragment>
              ) : (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    onClick={() => setDrawerOpen(false)}
                    className={styles.drawerItemButton}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {item.icon}
                      <ListItemText primary={item.label} />
                    </Box>
                  </ListItemButton>
                </ListItem>
              )
            )}
            {fullName && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setDrawerOpen(false);
                    handleLogout();
                  }}
                  className={styles.drawerItemButton}
                >
                  <ListItemText primary="Đăng xuất" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
