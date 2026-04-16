import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { COLORS } from "@/theme";

interface Props {
  open: boolean;
  friendName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteFriendModal({ open, friendName, onClose, onConfirm }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          bgcolor: COLORS.surfaceContainerLowest,
          boxShadow: "0 24px 64px -8px rgba(22, 29, 25, 0.12)",
        },
      }}
    >
      <DialogContent sx={{ p: 3.5, pt: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Typography
            sx={{ fontWeight: 800, fontSize: "1.125rem", color: COLORS.onSurface, letterSpacing: "-0.02em" }}
          >
            Delete Friend
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: COLORS.onSurfaceVariant,
              bgcolor: COLORS.surfaceContainerLow,
              "&:hover": { bgcolor: COLORS.surfaceContainer },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Warning icon */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "18px",
              bgcolor: COLORS.errorContainer,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningAmberRoundedIcon sx={{ fontSize: 36, color: COLORS.error }} />
          </Box>
        </Box>

        {/* Message */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            color: COLORS.onSurface,
            textAlign: "center",
            mb: 1,
          }}
        >
          Remove {friendName}?
        </Typography>
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: COLORS.onSurfaceVariant,
            textAlign: "center",
            lineHeight: 1.6,
            mb: 3.5,
          }}
        >
          This will permanently delete{" "}
          <Box component="span" sx={{ fontWeight: 700, color: COLORS.onSurface }}>
            {friendName}
          </Box>{" "}
          and all their transaction history. This action cannot be undone.
        </Typography>

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            onClick={onClose}
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              bgcolor: COLORS.surfaceContainerHigh,
              color: COLORS.onSurface,
              "&:hover": { bgcolor: COLORS.surfaceContainerHighest },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            fullWidth
            startIcon={<DeleteForeverRoundedIcon />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              bgcolor: COLORS.error,
              color: "#fff",
              "&:hover": { bgcolor: COLORS.onErrorContainer },
            }}
          >
            Delete
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
