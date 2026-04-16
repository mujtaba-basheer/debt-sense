import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { COLORS } from "@/theme";

const TABS = [
  { label: "Dashboard", Icon: DashboardRoundedIcon, to: "/dashboard" },
  { label: "Friends", Icon: PeopleRoundedIcon, to: "/friends" },
  { label: "Activity", Icon: ReceiptLongRoundedIcon, to: "/activity" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        bgcolor: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: "0 -4px 40px -5px rgba(22, 29, 25, 0.08)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        px: 2,
        pt: 1.5,
        pb: 3,
      }}
    >
      {TABS.map(({ label, Icon, to }) => {
        const active =
          location.pathname === to ||
          (to === "/dashboard" && location.pathname === "/");
        return (
          <Box
            key={to}
            onClick={() => navigate(to)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              px: active ? 2.5 : 1.5,
              py: 0.75,
              borderRadius: 2,
              bgcolor: active ? `${COLORS.primaryContainer}22` : "transparent",
              transition: "background-color 0.15s ease",
              minWidth: 72,
            }}
          >
            <Icon
              sx={{
                fontSize: 22,
                color: active ? COLORS.primaryContainer : `${COLORS.onSurface}55`,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.625rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: active ? COLORS.primaryContainer : `${COLORS.onSurface}55`,
                lineHeight: 1,
              }}
            >
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
