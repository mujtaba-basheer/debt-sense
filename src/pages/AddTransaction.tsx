import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  OutlinedInput,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import FlightRoundedIcon from "@mui/icons-material/FlightRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { COLORS } from "@/theme";

// ─── Data ──────────────────────────────────────────────────────────────────────

const FRIENDS = [
  { id: "1", name: "Julian Casablancas", initials: "JC", avatarColor: "#006c49" },
  { id: "2", name: "Amelie Poulain", initials: "AP", avatarColor: "#a43a3a" },
  { id: "3", name: "Albert Hammond Jr.", initials: "AH", avatarColor: "#376850" },
  { id: "4", name: "Elena Rodriguez", initials: "ER", avatarColor: "#005236" },
  { id: "5", name: "Marko V.", initials: "MV", avatarColor: "#3c6c54" },
  { id: "6", name: "Sarah Jenkins", initials: "SJ", avatarColor: "#006c49" },
  { id: "7", name: "Alex Rivera", initials: "AR", avatarColor: "#376850" },
];

const CATEGORIES = [
  { value: "dining", label: "Dining", icon: <RestaurantRoundedIcon sx={{ fontSize: 18 }} /> },
  { value: "transport", label: "Transport", icon: <DirectionsCarRoundedIcon sx={{ fontSize: 18 }} /> },
  { value: "groceries", label: "Groceries", icon: <LocalGroceryStoreRoundedIcon sx={{ fontSize: 18 }} /> },
  { value: "shopping", label: "Shopping", icon: <ShoppingBagRoundedIcon sx={{ fontSize: 18 }} /> },
  { value: "travel", label: "Travel", icon: <FlightRoundedIcon sx={{ fontSize: 18 }} /> },
  { value: "leisure", label: "Leisure", icon: <SportsEsportsRoundedIcon sx={{ fontSize: 18 }} /> },
  { value: "rent", label: "Rent", icon: <HomeRoundedIcon sx={{ fontSize: 18 }} /> },
  { value: "other", label: "Other", icon: <MoreHorizRoundedIcon sx={{ fontSize: 18 }} /> },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{
        display: "block",
        color: COLORS.onSurfaceVariant,
        fontWeight: 600,
        mb: 1,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontSize: "0.6875rem",
      }}
    >
      {children}
    </Typography>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        bgcolor: COLORS.surfaceContainerLowest,
        borderRadius: 3,
        px: 3,
        py: 3,
        boxShadow: "0 12px 40px -5px rgba(22, 29, 25, 0.06)",
      }}
    >
      {children}
    </Box>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AddTransaction() {
  const navigate = useNavigate();

  const [type, setType] = useState<"lent" | "borrowed">("lent");
  const [amount, setAmount] = useState("");
  const [friendId, setFriendId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptAttached, setReceiptAttached] = useState(false);

  const selectedFriend = FRIENDS.find((f) => f.id === friendId);
  const isLent = type === "lent";
  const accentColor = isLent ? COLORS.primary : COLORS.tertiary;
  const canSubmit = amount !== "" && parseFloat(amount) > 0 && friendId !== "" && category !== "";

  const handleSubmit = () => {
    // TODO: wire up to Netlify DB
    navigate("/dashboard");
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      {/* Back */}
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate(-1)}
        disableRipple
        sx={{
          mb: 3,
          px: 0,
          color: COLORS.onSurfaceVariant,
          fontWeight: 500,
          "&:hover": { bgcolor: "transparent", color: COLORS.onSurface },
        }}
      >
        Back
      </Button>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: COLORS.onSurface, letterSpacing: "-0.02em" }}
        >
          Add Transaction
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.onSurfaceVariant, mt: 0.5 }}>
          Log a new debt or credit entry to keep your balances accurate.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* ── Type + Amount card ── */}
        <SectionCard>
          {/* Lent / Borrowed toggle */}
          <FieldLabel>Transaction type</FieldLabel>
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={(_, v) => v && setType(v)}
            fullWidth
            sx={{ mb: 3 }}
          >
            {(["lent", "borrowed"] as const).map((t) => {
              const active = type === t;
              const color = t === "lent" ? COLORS.primary : COLORS.tertiary;
              return (
                <ToggleButton
                  key={t}
                  value={t}
                  sx={{
                    flex: 1,
                    py: 1.25,
                    borderRadius: "8px !important",
                    border: "none !important",
                    textTransform: "none",
                    fontWeight: active ? 700 : 500,
                    fontSize: "0.9375rem",
                    bgcolor: active ? `${color}18` : COLORS.surfaceContainerLow,
                    color: active ? color : COLORS.onSurfaceVariant,
                    "&:hover": { bgcolor: active ? `${color}22` : COLORS.surfaceContainerHigh },
                    "&.Mui-selected": {
                      bgcolor: `${color}18`,
                      color: color,
                      "&:hover": { bgcolor: `${color}22` },
                    },
                    mx: 0.5,
                  }}
                >
                  {t === "lent" ? "I Lent" : "I Borrowed"}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>

          {/* Amount */}
          <FieldLabel>Amount</FieldLabel>
          <OutlinedInput
            value={amount}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*\.?\d{0,2}$/.test(v)) setAmount(v);
            }}
            placeholder="0.00"
            startAdornment={
              <InputAdornment position="start">
                <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: accentColor }}>
                  $
                </Typography>
              </InputAdornment>
            }
            inputProps={{ inputMode: "decimal" }}
            sx={{
              width: "100%",
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: accentColor,
              "& input": { color: accentColor, fontWeight: 700 },
              "& input::placeholder": { color: COLORS.surfaceContainerHighest, opacity: 1 },
            }}
          />
        </SectionCard>

        {/* ── Friend card ── */}
        <SectionCard>
          <FieldLabel>Friend</FieldLabel>
          <Select
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            displayEmpty
            fullWidth
            renderValue={() =>
              selectedFriend ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: selectedFriend.avatarColor,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {selectedFriend.initials}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.onSurface }}>
                    {selectedFriend.name}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: COLORS.onSurfaceVariant }}>
                  Select a friend…
                </Typography>
              )
            }
            sx={{
              bgcolor: COLORS.surfaceContainerLow,
              borderRadius: 2,
              "& fieldset": { border: "none" },
            }}
          >
            {FRIENDS.map((f) => (
              <MenuItem key={f.id} value={f.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: f.avatarColor,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {f.initials}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {f.name}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </SectionCard>

        {/* ── Date + Category card ── */}
        <SectionCard>
          {/* Date */}
          <FieldLabel>Date</FieldLabel>
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                bgcolor: COLORS.surfaceContainerLow,
                borderRadius: 2,
                "& fieldset": { border: "none" },
              },
            }}
          />

          {/* Category */}
          <FieldLabel>Category</FieldLabel>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {CATEGORIES.map((cat) => {
              const active = category === cat.value;
              return (
                <Chip
                  key={cat.value}
                  icon={
                    <Box
                      sx={{
                        color: active ? accentColor : COLORS.onSurfaceVariant,
                        display: "flex",
                        alignItems: "center",
                        ml: "8px !important",
                      }}
                    >
                      {cat.icon}
                    </Box>
                  }
                  label={cat.label}
                  onClick={() => setCategory(active ? "" : cat.value)}
                  deleteIcon={active ? <CheckRoundedIcon sx={{ fontSize: "14px !important" }} /> : undefined}
                  onDelete={active ? () => setCategory("") : undefined}
                  sx={{
                    bgcolor: active ? `${accentColor}18` : COLORS.surfaceContainerLow,
                    color: active ? accentColor : COLORS.onSurfaceVariant,
                    fontWeight: active ? 600 : 400,
                    border: "none",
                    "& .MuiChip-deleteIcon": { color: accentColor },
                    "&:hover": {
                      bgcolor: active ? `${accentColor}22` : COLORS.surfaceContainerHigh,
                    },
                  }}
                />
              );
            })}
          </Box>
        </SectionCard>

        {/* ── Notes + Receipt card ── */}
        <SectionCard>
          <FieldLabel>Notes (optional)</FieldLabel>
          <OutlinedInput
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note about this transaction…"
            multiline
            rows={3}
            fullWidth
            sx={{
              bgcolor: COLORS.surfaceContainerLow,
              borderRadius: 2,
              fontSize: "0.875rem",
              "& fieldset": { border: "none" },
              mb: 2.5,
            }}
          />

          <Divider sx={{ mb: 2.5 }} />

          <Box
            onClick={() => setReceiptAttached((v) => !v)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              p: 1.5,
              borderRadius: 2,
              bgcolor: receiptAttached ? `${COLORS.primary}10` : COLORS.surfaceContainerLow,
              transition: "background-color 0.15s ease",
              "&:hover": { bgcolor: receiptAttached ? `${COLORS.primary}18` : COLORS.surfaceContainerHigh },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: receiptAttached ? `${COLORS.primary}18` : COLORS.surfaceContainerHigh,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: receiptAttached ? COLORS.primary : COLORS.onSurfaceVariant,
                flexShrink: 0,
              }}
            >
              <AttachFileRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: receiptAttached ? COLORS.primary : COLORS.onSurface,
                }}
              >
                {receiptAttached ? "Receipt attached" : "Attach Receipt"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}
              >
                {receiptAttached ? "Tap to remove" : "Photo, PDF, or image file"}
              </Typography>
            </Box>
            {receiptAttached && (
              <CheckRoundedIcon sx={{ ml: "auto", color: COLORS.primary, fontSize: 18 }} />
            )}
          </Box>
        </SectionCard>

        {/* ── Actions ── */}
        <Box sx={{ display: "flex", gap: 2, pt: 1, pb: 4 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(-1)}
            sx={{
              py: 1.5,
              borderRadius: 2,
              borderColor: `${COLORS.outlineVariant}66`,
              color: COLORS.onSurface,
              fontWeight: 500,
              "&:hover": {
                borderColor: COLORS.outline,
                bgcolor: COLORS.surfaceContainerLow,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth
            disabled={!canSubmit}
            onClick={handleSubmit}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: "0.9375rem",
              background: canSubmit
                ? `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryContainer} 100%)`
                : undefined,
            }}
          >
            Save Transaction
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
