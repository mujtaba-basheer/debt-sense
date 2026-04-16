import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  InputAdornment,
  OutlinedInput,
  MenuItem,
  Select,
  Button,
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import { COLORS } from "@/theme";
import { fmt } from "@/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type FriendStatus = "active" | "overdue" | "settled";

interface Friend {
  id: string;
  name: string;
  initials: string;
  group: string;
  balance: number; // positive = they owe you, negative = you owe them
  status: FriendStatus;
  statusLabel?: string; // e.g. "Overdue 3 days"
  connections?: number;
  avatarColor?: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const FRIENDS: Friend[] = [
  {
    id: "1",
    name: "Julian Casablancas",
    initials: "JC",
    group: "NYC Creative Group",
    balance: 3240,
    status: "active",
    avatarColor: "#006c49",
  },
  {
    id: "2",
    name: "Amelie Poulain",
    initials: "AP",
    group: "Travel & Events",
    balance: -1150,
    status: "overdue",
    statusLabel: "Overdue 3 days",
    avatarColor: "#a43a3a",
  },
  {
    id: "3",
    name: "Albert Hammond Jr.",
    initials: "AH",
    group: "Business Ventures",
    balance: 0,
    status: "settled",
    avatarColor: "#376850",
  },
  {
    id: "4",
    name: "Elena Rodriguez",
    initials: "ER",
    group: "Design & Logistics Co-Op",
    balance: 8500,
    status: "active",
    connections: 4,
    avatarColor: "#005236",
  },
  {
    id: "5",
    name: "Marko V.",
    initials: "MV",
    group: "Photography Studio",
    balance: -420,
    status: "settled",
    statusLabel: "Settled 2 days late",
    avatarColor: "#3c6c54",
  },
  {
    id: "6",
    name: "Sarah Jenkins",
    initials: "SJ",
    group: "Flatmates",
    balance: 1200,
    status: "active",
    avatarColor: "#006c49",
  },
  {
    id: "7",
    name: "Alex Rivera",
    initials: "AR",
    group: "Work Team",
    balance: 450,
    status: "active",
    avatarColor: "#376850",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CHIP: Record<
  FriendStatus,
  { label: string; color: "success" | "error" | "default" }
> = {
  active: { label: "Active", color: "success" },
  overdue: { label: "Overdue", color: "error" },
  settled: { label: "Settled", color: "default" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({
  label,
  amount,
  positive,
}: {
  label: string;
  amount: number;
  positive?: boolean;
}) {
  const color =
    positive === undefined
      ? COLORS.onSurface
      : positive
      ? COLORS.primary
      : COLORS.tertiary;

  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: COLORS.surfaceContainerLowest,
        borderRadius: 3,
        px: 3,
        py: 2.5,
        boxShadow: "0 12px 40px -5px rgba(22, 29, 25, 0.06)",
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: COLORS.onSurfaceVariant, display: "block", mb: 0.5 }}
      >
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color, letterSpacing: "-0.02em" }}
      >
        {positive !== undefined && (positive ? "+" : "-")}
        {fmt(amount)}
      </Typography>
    </Box>
  );
}

function FriendRow({ friend, isMobile }: { friend: Friend; isMobile: boolean }) {
  const navigate = useNavigate();
  const isPositive = friend.balance > 0;
  const isZero = friend.balance === 0;
  const chip = STATUS_CHIP[friend.status];

  return (
    <Box
      onClick={() => navigate(`/friends/${friend.id}`)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: { xs: 2.5, md: 3 },
        py: { xs: 2, md: 2.5 },
        bgcolor: COLORS.surfaceContainerLowest,
        borderRadius: 3,
        cursor: "pointer",
        transition: "background-color 0.15s ease",
        "&:hover": { bgcolor: COLORS.surfaceContainer },
        opacity: isZero && isMobile ? 0.7 : 1,
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: { xs: 50, md: 44 },
          height: { xs: 50, md: 44 },
          bgcolor: friend.avatarColor ?? COLORS.primary,
          color: "#fff",
          fontWeight: 700,
          fontSize: { xs: "0.9375rem", md: "0.875rem" },
          flexShrink: 0,
          borderRadius: { xs: 2, md: "50%" },
        }}
      >
        {friend.initials}
      </Avatar>

      {/* Name + group */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, color: COLORS.onSurface }}
            noWrap
          >
            {friend.name}
          </Typography>
          {!isMobile && (
            <Chip
              label={friend.statusLabel ?? chip.label}
              color={chip.color}
              size="small"
              sx={{ height: 20, fontSize: "0.6875rem" }}
            />
          )}
          {!isMobile && friend.connections && (
            <Typography
              variant="caption"
              sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}
            >
              +{friend.connections} connections
            </Typography>
          )}
        </Box>
        <Typography
          variant="body2"
          sx={{ color: COLORS.onSurfaceVariant, fontSize: "0.8125rem" }}
          noWrap
        >
          {friend.group}
        </Typography>
      </Box>

      {/* Balance */}
      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
        {isZero ? (
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, color: COLORS.onSurfaceVariant }}
          >
            Settled
          </Typography>
        ) : (
          <>
            {isMobile ? (
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: isPositive ? COLORS.primaryContainer : COLORS.tertiary,
                  display: "block",
                  mb: 0.25,
                  lineHeight: 1,
                }}
              >
                {isPositive ? "Owes You" : "You Owe"}
              </Typography>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
                {isPositive ? (
                  <ArrowUpwardRoundedIcon sx={{ fontSize: 16, color: COLORS.primary }} />
                ) : (
                  <ArrowDownwardRoundedIcon sx={{ fontSize: 16, color: COLORS.tertiary }} />
                )}
              </Box>
            )}
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                color: isPositive ? COLORS.primary : COLORS.tertiary,
                letterSpacing: "-0.01em",
              }}
            >
              {fmt(Math.abs(friend.balance))}
            </Typography>
            {!isMobile && (
              <Typography
                variant="caption"
                sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}
              >
                {isPositive ? "they owe you" : "you owe them"}
              </Typography>
            )}
          </>
        )}
      </Box>

      {!isMobile && (
        <ChevronRightRoundedIcon sx={{ color: COLORS.onSurfaceVariant, flexShrink: 0 }} />
      )}
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SortKey = "name" | "balance" | "status";

export default function FriendsList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("balance");

  const theyOweYou = FRIENDS.filter((f) => f.balance > 0).reduce(
    (sum, f) => sum + f.balance,
    0
  );
  const youOweThem = FRIENDS.filter((f) => f.balance < 0).reduce(
    (sum, f) => sum + Math.abs(f.balance),
    0
  );
  const netBalance = theyOweYou - youOweThem;
  const activeCount = FRIENDS.filter((f) => f.status === "active").length;

  const filtered = FRIENDS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "balance") return b.balance - a.balance;
    if (sort === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  return (
    <Box sx={{ maxWidth: { xs: "100%", md: 800 } }}>

      {/* ── Desktop header ── */}
      {!isMobile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: COLORS.onSurface, letterSpacing: "-0.02em" }}
            >
              Friends
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: COLORS.onSurfaceVariant, mt: 0.5 }}
            >
              {FRIENDS.length} friends · {FRIENDS.filter((f) => f.balance !== 0).length} with outstanding balances
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddRoundedIcon />}
            sx={{ borderRadius: 2, px: 2.5 }}
          >
            Add Friend
          </Button>
        </Box>
      )}

      {/* ── Mobile: search + invite button ── */}
      {isMobile && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
          <OutlinedInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search friends…"
            startAdornment={
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: COLORS.onSurfaceVariant, fontSize: 20 }} />
              </InputAdornment>
            }
            fullWidth
            sx={{ height: 52, fontSize: "0.875rem" }}
          />
          <Button
            variant="contained"
            fullWidth
            startIcon={<PersonAddRoundedIcon />}
            sx={{ py: 1.75, borderRadius: 2, fontWeight: 700 }}
          >
            Invite Friend
          </Button>
        </Box>
      )}

      {/* ── Summary cards ── */}
      {isMobile ? (
        /* Mobile: 2×2 grid — left card spans both rows */
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 2,
            mb: 5,
            // aspectRatio 2:1 on the grid means the left card (spanning
            // 2 rows = full grid height) has height ≈ its own column width → square
            aspectRatio: "2 / 1",
          }}
        >
          {/* Left — spans both rows */}
          <Box
            sx={{
              gridRow: "1 / 3",
              bgcolor: COLORS.primaryContainer,
              borderRadius: 3,
              p: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ArrowUpwardRoundedIcon
              sx={{ color: `${COLORS.onPrimaryContainer}cc`, fontSize: 28 }}
            />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: `${COLORS.onPrimaryContainer}99`,
                  display: "block",
                  mb: 0.5,
                }}
              >
                You Are Owed
              </Typography>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: COLORS.onPrimaryContainer,
                  fontSize: "1.375rem",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                {fmt(theyOweYou)}
              </Typography>
            </Box>
          </Box>

          {/* Top-right — You Owe */}
          <Box
            sx={{
              bgcolor: COLORS.surfaceContainerHigh,
              borderRadius: 3,
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <ArrowDownwardRoundedIcon
              sx={{ color: `${COLORS.tertiary}99`, fontSize: 18 }}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: "0.5625rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: COLORS.onSurfaceVariant,
                  display: "block",
                  mb: 0.25,
                }}
              >
                You Owe
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: COLORS.tertiary,
                  fontSize: "1.125rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {fmt(youOweThem)}
              </Typography>
            </Box>
          </Box>

          {/* Bottom-right — Active friends */}
          <Box
            sx={{
              bgcolor: COLORS.secondaryContainer,
              borderRadius: 3,
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <PeopleRoundedIcon
              sx={{ color: `${COLORS.onSecondaryContainer}66`, fontSize: 18 }}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: "0.5625rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: `${COLORS.onSecondaryContainer}99`,
                  display: "block",
                  mb: 0.25,
                }}
              >
                Active
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: COLORS.onSecondaryContainer,
                  fontSize: "1.125rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {activeCount} Friends
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        /* Desktop: 3-col equal row */
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <SummaryCard label="Net Balance" amount={netBalance} positive={netBalance >= 0} />
          <SummaryCard label="They Owe You" amount={theyOweYou} positive />
          <SummaryCard label="You Owe Them" amount={youOweThem} positive={false} />
        </Box>
      )}

      {/* ── Desktop filter bar ── */}
      {!isMobile && (
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <OutlinedInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search friends…"
            startAdornment={
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: COLORS.onSurfaceVariant, fontSize: 20 }} />
              </InputAdornment>
            }
            sx={{ flex: 1, height: 44, fontSize: "0.875rem" }}
          />
          <Select
            value={sort}
            onChange={(e: SelectChangeEvent) => setSort(e.target.value as SortKey)}
            displayEmpty
            sx={{
              height: 44,
              fontSize: "0.875rem",
              bgcolor: COLORS.surfaceContainerLow,
              "& fieldset": { border: "none" },
              minWidth: 160,
            }}
          >
            <MenuItem value="balance">Sort: Balance</MenuItem>
            <MenuItem value="name">Sort: Name</MenuItem>
            <MenuItem value="status">Sort: Status</MenuItem>
          </Select>
        </Box>
      )}

      {/* ── Mobile section header with sort toggle ── */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: 700, color: COLORS.onSurface }}
          >
            All Friends
          </Typography>
          <Typography
            onClick={() => setSort(sort === "balance" ? "name" : "balance")}
            sx={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: COLORS.primaryContainer,
              cursor: "pointer",
            }}
          >
            Sort: {sort === "balance" ? "Balance" : "Name"}
          </Typography>
        </Box>
      )}

      {/* ── Friends list ── */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: isMobile ? 2 : 1.5 }}>
        {filtered.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
              bgcolor: COLORS.surfaceContainerLowest,
              borderRadius: 3,
            }}
          >
            <Typography variant="body1" sx={{ color: COLORS.onSurfaceVariant }}>
              No friends match &ldquo;{search}&rdquo;
            </Typography>
          </Box>
        ) : (
          filtered.map((friend) => (
            <FriendRow key={friend.id} friend={friend} isMobile={isMobile} />
          ))
        )}
      </Box>
    </Box>
  );
}
