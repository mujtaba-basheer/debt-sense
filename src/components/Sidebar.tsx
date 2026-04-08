import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { COLORS } from "@/theme";

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardRoundedIcon />, to: "/dashboard" },
  { label: "Friends", icon: <PeopleRoundedIcon />, to: "/friends" },
  { label: "Add Transaction", icon: <AddCircleRoundedIcon />, to: "/transactions/add" },
  { label: "Activity", icon: <ReceiptLongRoundedIcon />, to: "/activity" },
];

export const SIDEBAR_WIDTH = 240;

export default function Sidebar() {
  const location = useLocation();

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: COLORS.surfaceContainerLow, // #eef6ee — tonal layering, no borders
        px: 1.5,
        py: 3,
      }}
    >
      {/* Branding */}
      <Box sx={{ px: 1.5, mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: COLORS.primary,
            letterSpacing: "-0.5px",
          }}
        >
          DebtSense
        </Typography>
        <Typography variant="caption" sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}>
          Personal finance tracker
        </Typography>
      </Box>

      {/* Navigation */}
      <List disablePadding sx={{ flex: 1 }}>
        {NAV_ITEMS.map(({ label, icon, to }) => {
          const active = location.pathname === to;
          return (
            <ListItemButton
              key={to}
              component={NavLink}
              to={to}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                px: 1.5,
                py: 1,
                color: active ? COLORS.primary : COLORS.onSurfaceVariant,
                bgcolor: active ? `${COLORS.primary}14` : "transparent", // 8% opacity tint
                "&:hover": {
                  bgcolor: active
                    ? `${COLORS.primary}1f`  // 12% on hover
                    : COLORS.surfaceContainerHigh,
                },
                transition: "background-color 0.15s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: active ? COLORS.primary : COLORS.onSurfaceVariant,
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{
                  primary: {
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? COLORS.onSurface : COLORS.onSurfaceVariant,
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Footer */}
      <Box>
        <Divider sx={{ mb: 2 }} />

        <ListItemButton
          sx={{
            borderRadius: 2,
            px: 1.5,
            py: 1,
            mb: 1.5,
            color: COLORS.onSurfaceVariant,
            "&:hover": { bgcolor: COLORS.surfaceContainerHigh },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: COLORS.onSurfaceVariant }}>
            <SettingsRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            slotProps={{
              primary: { fontSize: "0.875rem", color: COLORS.onSurfaceVariant },
            }}
          />
        </ListItemButton>

        {/* User profile chip */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: 2,
            bgcolor: COLORS.surfaceContainerLowest, // white card on green-tinted sidebar
            boxShadow: "0 4px 20px rgba(22, 29, 25, 0.06)", // Forest Shadow
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: COLORS.primary,
              color: COLORS.onPrimary,
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            MB
          </Avatar>
          <Box sx={{ overflow: "hidden" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, lineHeight: 1.2, color: COLORS.onSurface }}
              noWrap
            >
              Mujtaba B.
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}
              noWrap
            >
              Personal account
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
