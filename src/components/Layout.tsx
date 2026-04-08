import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default", // #f8f9fa — surface
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0, // prevent flex overflow
          overflowY: "auto",
          px: { xs: 3, md: 5 },
          py: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
