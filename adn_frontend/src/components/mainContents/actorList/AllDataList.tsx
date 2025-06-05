import { Box, Button, Paper, TableContainer } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";

const DataList = () => {
  const linkStyle = {
    backgroundColor: "white",
    color: "black",
    border: "1px solid #ccc",
    borderRadius: "6px",
    margin: "0 8px 8px 0",
    padding: "6px 16px",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
    "&.active": {
      backgroundColor: "#1976d2",
      color: "white",
    },
  };

  return (
    <TableContainer component={Paper} sx={{ p: 2 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", mb: 2 }}>
        <Button component={NavLink} to="/admin/user" sx={linkStyle}>
          Danh sách người dùng
        </Button>
        <Button component={NavLink} to="/admin/manager" sx={linkStyle}>
          Danh sách quản lý
        </Button>
        <Button component={NavLink} to="/admin/staff" sx={linkStyle}>
          Danh sách nhân viên
        </Button>
      </Box>
      <Outlet />
    </TableContainer>
  );
};

export default DataList;
