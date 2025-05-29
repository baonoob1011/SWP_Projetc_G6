import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Lỗi khi logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      navigate("/login");
    }
  };

  return (
    <Box mt={2}>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default Logout;
