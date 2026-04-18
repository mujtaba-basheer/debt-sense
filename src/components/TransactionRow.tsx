import { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogContent,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { COLORS } from "@/theme";
import { fmt, CATEGORY_ICONS, apiFetch } from "@/utils";

interface Props {
  id?: string;
  description: string;
  category: string;
  subtitle?: string;
  amount: number;
  positive: boolean;
  amountLabel?: string;
  iconSize?: number;
  showTrendIcon?: boolean;
  showDivider?: boolean;
  positiveColor?: string;
  negativeColor?: string;
  status?: "pending" | "settled";
}

export default function TransactionRow({
  id,
  description,
  category,
  subtitle,
  amount,
  positive,
  amountLabel,
  iconSize = 44,
  showTrendIcon = false,
  showDivider = false,
  positiveColor = COLORS.primary,
  negativeColor = COLORS.tertiary,
  status,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [deleted, setDeleted] = useState(false);

  const hasActions = !!id;
  const isSettled = currentStatus === "settled";
  const amountColor = positive ? positiveColor : negativeColor;
  const icon = CATEGORY_ICONS[category] ?? CATEGORY_ICONS["dining"];

  const closeAll = () => {
    setMenuAnchor(null);
    setSheetOpen(false);
  };

  async function handleSettle() {
    closeAll();
    await apiFetch(`/api/transaction/${id}/settle`, { method: "PUT" });
    setCurrentStatus("settled");
  }

  async function handleDelete() {
    closeAll();
    await apiFetch(`/api/transaction/${id}`, { method: "DELETE" });
    setDeleted(true);
  }

  if (deleted) return null;

  return (
    <Box>
      <Box
        onClick={hasActions && isMobile ? () => setSheetOpen(true) : undefined}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: 1.75,
          ...(hasActions && isMobile
            ? { cursor: "pointer", borderRadius: 2, mx: -1, px: 1, "&:active": { bgcolor: COLORS.surfaceContainerLow } }
            : {}),
        }}
      >
        {/* Category icon */}
        <Box
          sx={{
            width: iconSize,
            height: iconSize,
            borderRadius: 2,
            bgcolor: COLORS.surfaceContainerLow,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.onSurfaceVariant,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        {/* Description + subtitle */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.onSurface }} noWrap>
            {description}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Amount + label + settled chip */}
        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
          {isSettled ? (
            <Chip
              label="Settled"
              size="small"
              icon={<CheckCircleRoundedIcon sx={{ fontSize: "12px !important", color: `${COLORS.primary} !important` }} />}
              sx={{
                height: 20,
                fontSize: "0.6875rem",
                fontWeight: 600,
                bgcolor: `${COLORS.primary}14`,
                color: COLORS.primary,
                mb: amountLabel ? 0.5 : 0,
              }}
            />
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
              {showTrendIcon && (
                positive
                  ? <TrendingUpRoundedIcon sx={{ fontSize: 14, color: positiveColor }} />
                  : <TrendingDownRoundedIcon sx={{ fontSize: 14, color: negativeColor }} />
              )}
              <Typography variant="body2" sx={{ fontWeight: 700, color: amountColor }}>
                {positive ? "+" : "-"}{fmt(amount)}
              </Typography>
            </Box>
          )}
          {amountLabel && (
            <Typography
              variant="caption"
              sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}
            >
              {amountLabel}
            </Typography>
          )}
        </Box>

        {/* Desktop three-dot menu */}
        {hasActions && !isMobile && (
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); }}
            sx={{ color: COLORS.onSurfaceVariant, ml: 0.5 }}
          >
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {showDivider && <Divider />}

      {/* Desktop context menu */}
      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={() => setMenuAnchor(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{ paper: { sx: { borderRadius: 2, minWidth: 180 } } }}
      >
        {!isSettled && (
          <MenuItem onClick={handleSettle} sx={{ gap: 1 }}>
            <ListItemIcon sx={{ minWidth: 0 }}>
              <CheckCircleRoundedIcon fontSize="small" sx={{ color: COLORS.primary }} />
            </ListItemIcon>
            <ListItemText primary={
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>Mark as Settled</Typography>
            } />
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ gap: 1 }}>
          <ListItemIcon sx={{ minWidth: 0 }}>
            <DeleteOutlineRoundedIcon fontSize="small" sx={{ color: COLORS.error }} />
          </ListItemIcon>
          <ListItemText primary={
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: COLORS.error }}>Delete</Typography>
          } />
        </MenuItem>
      </Menu>

      {/* Mobile bottom sheet */}
      <Dialog
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px 20px 0 0",
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              m: 0,
              width: "100%",
              maxWidth: "100%",
            },
          },
        }}
      >
        <DialogContent sx={{ pb: 4 }}>
          <Box
            sx={{
              width: 36,
              height: 4,
              borderRadius: 99,
              bgcolor: COLORS.outlineVariant,
              mx: "auto",
              mb: 2.5,
            }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: COLORS.onSurface, mb: 0.5 }}>
            {description}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: COLORS.onSurfaceVariant, display: "block", mb: 2.5 }}>
              {subtitle}
            </Typography>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {!isSettled && (
              <Button
                fullWidth
                variant="contained"
                startIcon={<CheckCircleRoundedIcon />}
                onClick={handleSettle}
                sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
              >
                Mark as Settled
              </Button>
            )}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={handleDelete}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 700,
                borderColor: `${COLORS.error}44`,
                color: COLORS.error,
                "&:hover": { borderColor: COLORS.error, bgcolor: COLORS.errorContainer },
              }}
            >
              Delete Transaction
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
