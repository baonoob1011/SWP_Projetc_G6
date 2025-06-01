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
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../image/Logo.png";

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
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout API error:", error);
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    {
      label: "Dịch vụ",
      children: [
        { label: "Hành chính", path: "/service/administrative" },
        { label: "Dân sự", path: "/service/civil" },
      ],
    },
    { label: "Tin tức", path: "/blog" },
    { label: "Đặt lịch", path: "/order" },
    { label: "Chi nhánh", path: "/map" },
  ];

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#206696" }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <Box sx={{ width: 40, mr: 2 }}>
              <img src={logo} alt="Logo" style={{ width: "100%", objectFit: "contain" }} />
            </Box>
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 10 }}>
            {navItems.map((item) =>
              item.children ? (
                <Box key={item.label} sx={{ position: "relative" }}>
                  <Button
                    sx={{ color: "white" }}
                    onClick={(e) => handleOpenMenu(e, item.label)}
                  >
                    {item.label}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuOpen === item.label}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        bgcolor: "primary.main",
                        color: "white",
                        mt: 0,
                        boxShadow: "none",
                        "& .MuiMenu-list": { paddingY: 0 },
                      },
                    }}
                  >
                    {item.children.map((child) => (
                      <MenuItem
                        key={child.label}
                        component={NavLink}
                        to={child.path}
                        onClick={handleCloseMenu}
                        sx={{ color: "white", "&:hover": { bgcolor: "primary.dark" } }}
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
                  sx={{ color: "white" }}
                >
                  {item.label}
                </Button>
              )
            )}
          </Box>

          {/* Auth + Mobile Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {fullName ? (
              role === "ADMIN" ? (
                <>
                  <Button sx={{ color: "white" }} onClick={(e) => handleOpenMenu(e, "ADMIN")}>
                    Welcome, {fullName}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuOpen === "ADMIN"}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        bgcolor: "primary.main",
                        color: "white",
                        mt: 0,
                        boxShadow: "none",
                        "& .MuiMenu-list": { paddingY: 0 },
                      },
                    }}
                  >
                    <MenuItem
                      component={NavLink}
                      to="/signup-manager"
                      onClick={handleCloseMenu}
                      sx={{ color: "white", "&:hover": { bgcolor: "primary.dark" } }}
                    >
                      Thông tin quản lý
                    </MenuItem>
                    <MenuItem
                      component={NavLink}
                      to="/signup-staff"
                      onClick={handleCloseMenu}
                      sx={{ color: "white", "&:hover": { bgcolor: "primary.dark" } }}
                    >
                      Thông tin nhân viên
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseMenu();
                        handleLogout();
                      }}
                      sx={{ color: "white", "&:hover": { bgcolor: "primary.dark" } }}
                    >
                      Đăng xuất
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Typography variant="body2" sx={{ color: "white" }}>
                    Welcome, {fullName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "white" }}>
                    |
                  </Typography>
                  <Button
                    component={NavLink}
                    to="/home"
                    color="inherit"
                    onClick={handleLogout}
                  >
                    Đăng Xuất
                  </Button>
                </>
              )
            ) : (
              <>
                <Button color="inherit" component={NavLink} to="/login">
                  Đăng nhập
                </Button>
                <Typography variant="body2" sx={{ color: "white" }}>
                  |
                </Typography>
                <Button color="inherit" component={NavLink} to="/signup">
                  Đăng ký
                </Button>
              </>
            )}

            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              sx={{ display: { md: "none" } }}
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
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {navItems.map((item) =>
              item.children ? (
                <React.Fragment key={item.label}>
                  <ListItem>
                    <ListItemText primary={item.label} />
                  </ListItem>
                  {item.children.map((child) => (
                    <ListItem key={child.label} disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to={child.path}
                        onClick={() => setDrawerOpen(false)}
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
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
