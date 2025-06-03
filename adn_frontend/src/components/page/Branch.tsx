import { Box, Button, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { LocationOn, Phone, AccessTime, Map } from "@mui/icons-material";

export default function Branch() {
  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "0 auto",
        padding: 3,
        borderRadius: 3,
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
          transform: "translateY(-2px)",
        },
        marginTop:17
      }}
    >
      {/* Header */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "#1a1a1a",
          marginBottom: 3,
          textAlign: "center",
          fontSize: { xs: "1.2rem", sm: "1.5rem" },
        }}
      >
        Thông Tin Chi Nhánh
      </Typography>

      {/* Address */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: 2.5,
          padding: 2,
          backgroundColor: "#f8f9fa",
          borderRadius: 2,
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: "#e9ecef",
          },
        }}
      >
        <LocationOn
          sx={{
            color: "#e74c3c",
            marginRight: 1.5,
            marginTop: 0.5,
            fontSize: 20,
          }}
        />
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              color: "#2c3e50",
              fontSize: "0.95rem",
              marginBottom: 0.5,
            }}
          >
            Địa Chỉ:
          </Typography>
          <Typography
            sx={{
              color: "#5a6c7d",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            22/14 Đ. Phan Văn Hớn, Tân Thới Nhất, Quận 12, Hồ Chí Minh 70000,
            Việt Nam
          </Typography>
        </Box>
      </Box>

      {/* Phone */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 2.5,
          padding: 2,
          backgroundColor: "#f8f9fa",
          borderRadius: 2,
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: "#e9ecef",
          },
        }}
      >
        <Phone
          sx={{
            color: "#27ae60",
            marginRight: 1.5,
            fontSize: 20,
          }}
        />
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              color: "#2c3e50",
              fontSize: "0.95rem",
              marginBottom: 0.5,
            }}
          >
            Số điện thoại:
          </Typography>
          <Typography
            component="a"
            href="tel:0943283195"
            sx={{
              color: "#27ae60",
              fontSize: "0.9rem",
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            0943.283.195
          </Typography>
        </Box>
      </Box>

      {/* Opening Hours */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 3,
          padding: 2,
          backgroundColor: "#f8f9fa",
          borderRadius: 2,
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: "#e9ecef",
          },
        }}
      >
        <AccessTime
          sx={{
            color: "#3498db",
            marginRight: 1.5,
            fontSize: 20,
          }}
        />
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              color: "#2c3e50",
              fontSize: "0.95rem",
              marginBottom: 0.5,
            }}
          >
            Giờ mở cửa:
          </Typography>
          <Typography
            sx={{
              color: "#5a6c7d",
              fontSize: "0.9rem",
            }}
          >
            7h - 17h30 từ thứ 2 tới thứ 6
          </Typography>
        </Box>
      </Box>

      {/* Map Button */}
      <Button
        component={NavLink}
        to="/map"
        variant="contained"
        startIcon={<Map />}
        fullWidth
        sx={{
          backgroundColor: "#3498db",
          color: "white",
          fontWeight: 600,
          fontSize: "0.95rem",
          padding: "12px 24px",
          borderRadius: 2,
          textTransform: "none",
          boxShadow: "0 2px 10px rgba(52, 152, 219, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#2980b9",
            boxShadow: "0 4px 15px rgba(52, 152, 219, 0.4)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        }}
      >
        Xem Bản Đồ
      </Button>
    </Box>
  );
}