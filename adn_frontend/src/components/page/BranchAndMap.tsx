import { Box, Paper, Divider } from "@mui/material";
import Branch from "./Branch";
import Map from "./Map";

export default function BranchAndMap() {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        pt: "100px", // Add padding top to account for the header
      }}
    >
      {/* Left side - Branch info */}
      <Box
        sx={{
          width: "40%",
          height: "calc(100vh - 100px)", // Subtract header height
          overflowY: "auto",
          padding: "24px",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
            "&:hover": {
              background: "#555",
            },
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <Branch />
        </Paper>
      </Box>

      {/* Divider */}
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          mx: 2,
          borderColor: "rgba(0, 0, 0, 0.1)",
          borderRightWidth: 2,
        }}
      />

      {/* Right side - Map */}
      <Box
        sx={{
          width: "60%",
          height: "calc(100vh - 100px)", // Subtract header height
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          m: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Map />
      </Box>
    </Box>
  );
} 