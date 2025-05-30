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
import { NavLink } from "react-router-dom";


type HeaderProps = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
};


export function Header({ username, setUsername }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Dropdown menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");   // Xóa username ở state App => Header re-render
    window.location.href = "/login";
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
  ];

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            Logo
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
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
                        "& .MuiMenu-list": {
                          paddingY: 0,
                        },
                      },
                    }}
                  >
                    {item.children.map((child) => (
                      <MenuItem
                        key={child.label}
                        component={NavLink}
                        to={child.path}
                        onClick={handleCloseMenu}
                        sx={{
                          color: "white",
                          "&:hover": {
                            backgroundColor: "primary.dark",
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
                  sx={{ color: "white" }}
                >
                  {item.label}
                </Button>
              )
            )}
          </Box>

          {/* Login/Logout + Mobile Menu button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {username ? (
              <>
                <Typography variant="body2" sx={{ color: "white" }}>
                  Welcome,{" "}{username}
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

      {/* Drawer (Mobile) */}
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
                        sx={{ pl: 4 }} // lùi vào chút cho con
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
