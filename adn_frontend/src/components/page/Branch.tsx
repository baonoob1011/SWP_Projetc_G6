import { Box, Typography, Card, CardContent } from "@mui/material";
import { LocationOn, Phone, AccessTime } from "@mui/icons-material";
import "./Branch.css";

export default function Branch() {
  return (
    <Card elevation={0} className="branch-card">
      <CardContent className="branch-content">
        {/* Header */}
        <Typography variant="h5" className="branch-title">
          Thông Tin Chi Nhánh
        </Typography>

        {/* Địa chỉ */}
        <Box className="info-box">
          <LocationOn className="info-icon location" />
          <Box>
            <Typography className="info-label">Địa Chỉ:</Typography>
            <Typography className="info-text">
              22/14 Đ. Phan Văn Hớn, Tân Thới Nhất, Quận 12, Hồ Chí Minh 70000, Việt Nam
            </Typography>
          </Box>
        </Box>

        {/* Số điện thoại */}
        <Box className="info-box">
          <Phone className="info-icon phone" />
          <Box>
            <Typography className="info-label">Số điện thoại:</Typography>
            <Typography
              component="a"
              href="tel:0943283195"
              className="phone-link"
            >
              0943.283.195
            </Typography>
          </Box>
        </Box>

        {/* Giờ mở cửa */}
        <Box className="info-box">
          <AccessTime className="info-icon time" />
          <Box>
            <Typography className="info-label">Giờ mở cửa:</Typography>
            <Typography className="info-text">
              7h - 17h30 từ thứ 2 tới thứ 6
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
