import { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { COLORS } from "@/theme";

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardRoundedIcon />, to: "/dashboard" },
  { label: "Friends", icon: <PeopleRoundedIcon />, to: "/friends" },
  { label: "Add Transaction", icon: <AddCircleRoundedIcon />, to: "/transactions/add" },
  { label: "Activity", icon: <ReceiptLongRoundedIcon />, to: "/activity" },
];

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {!isMobile && <Sidebar />}

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Mobile top app bar */}
        {isMobile && (
          <Box
            component="header"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              bgcolor: COLORS.surface,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: COLORS.primaryContainer, borderRadius: 2 }}
                size="small"
              >
                <MenuRoundedIcon />
              </IconButton>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: COLORS.primaryContainer,
                  letterSpacing: "-0.03em",
                  fontSize: "1.2rem",
                }}
              >
                DebtSense
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: COLORS.primary,
                color: COLORS.onPrimary,
                fontSize: "0.75rem",
                fontWeight: 700,
                border: `2px solid ${COLORS.primaryContainer}33`,
                mr: 1,
              }}
            >
              MB
            </Avatar>
          </Box>
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: "auto",
            px: { xs: 3, md: 5 },
            py: { xs: 3, md: 4 },
            pb: { xs: 14, md: 4 },
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {isMobile && <BottomNav />}

      {/* Mobile nav drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: COLORS.surfaceContainerLow,
            px: 1.5,
            py: 3,
          },
        }}
      >
        {/* Branding */}
        <Box sx={{ px: 1.5, mb: 4 }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: COLORS.primary,
              letterSpacing: "-0.5px",
              fontSize: "1.125rem",
            }}
          >
            DebtSense
          </Typography>
          <Typography variant="caption" sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}>
            Personal finance tracker
          </Typography>
        </Box>

        {/* Nav items */}
        <List disablePadding sx={{ flex: 1 }}>
          {NAV_ITEMS.map(({ label, icon, to }) => {
            const active = location.pathname === to;
            return (
              <ListItemButton
                key={to}
                component={NavLink}
                to={to}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: 1.5,
                  py: 1,
                  color: active ? COLORS.primary : COLORS.onSurfaceVariant,
                  bgcolor: active ? `${COLORS.primary}14` : "transparent",
                  "&:hover": {
                    bgcolor: active ? `${COLORS.primary}1f` : COLORS.surfaceContainerHigh,
                  },
                  transition: "background-color 0.15s ease",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? COLORS.primary : COLORS.onSurfaceVariant }}>
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
        <Box sx={{ mt: "auto" }}>
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
              slotProps={{ primary: { fontSize: "0.875rem", color: COLORS.onSurfaceVariant } }}
            />
          </ListItemButton>

          {/* User profile */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              bgcolor: COLORS.surfaceContainerLowest,
              boxShadow: "0 4px 20px rgba(22, 29, 25, 0.06)",
              cursor: "pointer",
            }}
            onClick={() => { navigate("/dashboard"); setDrawerOpen(false); }}
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
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2, color: COLORS.onSurface }} noWrap>
                Mujtaba B.
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }} noWrap>
                Personal account
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
