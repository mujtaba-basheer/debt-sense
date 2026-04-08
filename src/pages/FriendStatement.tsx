import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  Divider,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { COLORS } from "@/theme";
import { fmt, CATEGORY_ICONS } from "@/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  description: string;
  category: "dining" | "transport" | "leisure" | "shopping" | "groceries";
  date: string;
  total: number;
  yourShare: number; // positive = they owe you, negative = you owe them
}

interface SharedGroup {
  name: string;
  members: number;
  yourShare: number;
  dueDate?: string;
}

interface FriendData {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  group: string;
  balance: number;
  balanceChange: number; // % change from last month
  trustLevel: "Elite" | "Trusted" | "New";
  trustStreak: string;
  friendSince: string;
  totalTransactions: number;
  transactions: Transaction[];
  sharedGroups: SharedGroup[];
  categoryBreakdown: { label: string; pct: number; color: string }[];
}

// ─── Dummy data ────────────────────────────────────────────────────────────────

const FRIENDS_DATA: Record<string, FriendData> = {
  "1": {
    id: "1",
    name: "Julian Casablancas",
    initials: "JC",
    avatarColor: "#006c49",
    group: "NYC Creative Group",
    balance: 3240,
    balanceChange: 12,
    trustLevel: "Elite",
    trustStreak: "8-month streak of settling balances within 24 hours",
    friendSince: "March 2022",
    totalTransactions: 58,
    transactions: [
      { id: "t1", description: "Dinner at Le Bernardin", category: "dining", date: "Apr 7, 2026", total: 236.4, yourShare: 118.2 },
      { id: "t2", description: "Concert tickets", category: "leisure", date: "Apr 3, 2026", total: 160, yourShare: 80 },
      { id: "t3", description: "Grocery run", category: "groceries", date: "Mar 28, 2026", total: 87.5, yourShare: 43.75 },
      { id: "t4", description: "Cab to airport", category: "transport", date: "Mar 22, 2026", total: 31, yourShare: 15.5 },
    ],
    sharedGroups: [
      { name: "Hamptons Beach House", members: 5, yourShare: 1200, dueDate: "May 1, 2026" },
      { name: "Tokyo Trip 2026", members: 3, yourShare: 2400, dueDate: "Aug 15, 2026" },
    ],
    categoryBreakdown: [
      { label: "Dining", pct: 65, color: COLORS.primary },
      { label: "Transport", pct: 20, color: COLORS.secondary },
      { label: "Leisure", pct: 15, color: COLORS.primaryFixedDim },
    ],
  },
  "2": {
    id: "2",
    name: "Amelie Poulain",
    initials: "AP",
    avatarColor: "#a43a3a",
    group: "Travel & Events",
    balance: -1150,
    balanceChange: -8,
    trustLevel: "Trusted",
    trustStreak: "Usually settles within 1 week",
    friendSince: "January 2024",
    totalTransactions: 21,
    transactions: [
      { id: "t1", description: "Paris hotel split", category: "leisure", date: "Apr 1, 2026", total: 980, yourShare: -490 },
      { id: "t2", description: "Train tickets", category: "transport", date: "Mar 30, 2026", total: 220, yourShare: -110 },
      { id: "t3", description: "Restaurant L'Ami Jean", category: "dining", date: "Mar 29, 2026", total: 148, yourShare: -74 },
      { id: "t4", description: "Museum tickets", category: "leisure", date: "Mar 28, 2026", total: 52, yourShare: -26 },
    ],
    sharedGroups: [
      { name: "European Road Trip", members: 4, yourShare: -1400, dueDate: "Jun 10, 2026" },
    ],
    categoryBreakdown: [
      { label: "Leisure", pct: 55, color: COLORS.primary },
      { label: "Transport", pct: 28, color: COLORS.secondary },
      { label: "Dining", pct: 17, color: COLORS.primaryFixedDim },
    ],
  },
};

const DEFAULT_FRIEND: FriendData = {
  id: "0",
  name: "Sarah Miller",
  initials: "SM",
  avatarColor: "#006c49",
  group: "Flatmates",
  balance: 245.5,
  balanceChange: 12,
  trustLevel: "Elite",
  trustStreak: "8-month streak of settling balances within 24 hours",
  friendSince: "April 2023",
  totalTransactions: 42,
  transactions: [
    { id: "t1", description: "Dinner at Nobu", category: "dining", date: "Apr 7, 2026", total: 236.4, yourShare: 118.2 },
    { id: "t2", description: "Netflix & Spotify split", category: "leisure", date: "Apr 1, 2026", total: 31, yourShare: 15.5 },
    { id: "t3", description: "Weekly groceries", category: "groceries", date: "Mar 30, 2026", total: 143.8, yourShare: 71.9 },
    { id: "t4", description: "Uber to airport", category: "transport", date: "Mar 22, 2026", total: 39.8, yourShare: 19.9 },
  ],
  sharedGroups: [
    { name: "Beach House Rental", members: 5, yourShare: 800, dueDate: "May 20, 2026" },
    { name: "Tokyo Trip 2026", members: 3, yourShare: 2400, dueDate: "Aug 15, 2026" },
  ],
  categoryBreakdown: [
    { label: "Dining", pct: 65, color: COLORS.primary },
    { label: "Transport", pct: 20, color: COLORS.secondary },
    { label: "Leisure", pct: 15, color: COLORS.primaryFixedDim },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const TRUST_COLORS: Record<FriendData["trustLevel"], string> = {
  Elite: COLORS.primary,
  Trusted: COLORS.secondary,
  New: COLORS.onSurfaceVariant,
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function TransactionRow({ tx }: { tx: Transaction }) {
  const isPositive = tx.yourShare > 0;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 2,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: COLORS.surfaceContainerLow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.onSurfaceVariant,
          flexShrink: 0,
        }}
      >
        {CATEGORY_ICONS[tx.category]}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: COLORS.onSurface }}
          noWrap
        >
          {tx.description}
        </Typography>
        <Typography variant="caption" sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}>
          {tx.date} · Total {fmt(tx.total)}
        </Typography>
      </Box>

      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: isPositive ? COLORS.primary : COLORS.tertiary,
          }}
        >
          {isPositive ? "+" : "-"}{fmt(tx.yourShare)}
        </Typography>
        <Typography variant="caption" sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}>
          your share
        </Typography>
      </Box>
    </Box>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        bgcolor: COLORS.surfaceContainerLowest,
        borderRadius: 3,
        px: 3,
        py: 2.5,
        boxShadow: "0 12px 40px -5px rgba(22, 29, 25, 0.06)",
      }}
    >
      {children}
    </Box>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FriendStatement() {
  const { friendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();

  const friend = (friendId ? FRIENDS_DATA[friendId] : undefined) ?? DEFAULT_FRIEND;
  const isPositive = friend.balance >= 0;

  return (
    <Box sx={{ maxWidth: 720 }}>
      {/* Back */}
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate("/friends")}
        sx={{
          mb: 3,
          color: COLORS.onSurfaceVariant,
          fontWeight: 500,
          px: 0,
          "&:hover": { bgcolor: "transparent", color: COLORS.onSurface },
        }}
        disableRipple
      >
        Friends
      </Button>

      {/* Hero card */}
      <SectionCard>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5, mb: 3 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: friend.avatarColor,
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
          >
            {friend.initials}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: COLORS.onSurface, letterSpacing: "-0.02em" }}
              >
                {friend.name}
              </Typography>
              <Chip
                icon={
                  <WorkspacePremiumRoundedIcon
                    sx={{ fontSize: "14px !important", color: `${TRUST_COLORS[friend.trustLevel]} !important` }}
                  />
                }
                label={friend.trustLevel}
                size="small"
                sx={{
                  bgcolor: `${TRUST_COLORS[friend.trustLevel]}18`,
                  color: TRUST_COLORS[friend.trustLevel],
                  fontWeight: 600,
                  height: 22,
                  fontSize: "0.6875rem",
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: COLORS.onSurfaceVariant }}>
              {friend.group}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0, display: "block", mt: 0.5 }}
            >
              Top Friend since {friend.friendSince} · {friend.totalTransactions} transactions
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Balance */}
        <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="caption" sx={{ color: COLORS.onSurfaceVariant, display: "block", mb: 0.5 }}>
              {isPositive ? "They owe you" : "You owe them"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: isPositive ? COLORS.primary : COLORS.tertiary,
                  letterSpacing: "-0.03em",
                }}
              >
                {fmt(friend.balance)}
              </Typography>
              <Chip
                label={`${friend.balanceChange > 0 ? "+" : ""}${friend.balanceChange}% this month`}
                size="small"
                color={friend.balanceChange >= 0 ? "success" : "error"}
                sx={{ height: 20, fontSize: "0.6875rem" }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: COLORS.primary,
                textTransform: "none",
                letterSpacing: 0,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.75,
              }}
            >
              <WorkspacePremiumRoundedIcon sx={{ fontSize: 13 }} />
              {friend.trustStreak}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<NotificationsRoundedIcon />}
              sx={{
                borderRadius: 2,
                borderColor: `${COLORS.outlineVariant}66`,
                color: COLORS.onSurface,
                fontWeight: 500,
                "&:hover": { borderColor: COLORS.outline, bgcolor: COLORS.surfaceContainerLow },
              }}
            >
              Remind
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckCircleRoundedIcon />}
              sx={{ borderRadius: 2 }}
            >
              Settle Up
            </Button>
          </Box>
        </Box>
      </SectionCard>

      {/* Recent transactions */}
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: COLORS.onSurface, mb: 2, letterSpacing: "-0.01em" }}
        >
          Recent Transactions
        </Typography>
        <SectionCard>
          {friend.transactions.map((tx, i) => (
            <Box key={tx.id}>
              <TransactionRow tx={tx} />
              {i < friend.transactions.length - 1 && <Divider />}
            </Box>
          ))}
        </SectionCard>
      </Box>

      {/* Bottom row: breakdown + shared groups */}
      <Box sx={{ display: "flex", gap: 3, mt: 3 }}>
        {/* Expense breakdown */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: COLORS.onSurface, mb: 2, letterSpacing: "-0.01em" }}
          >
            Expense Breakdown
          </Typography>
          <SectionCard>
            {friend.categoryBreakdown.map((cat) => (
              <Box key={cat.label} sx={{ mb: 2.5, "&:last-child": { mb: 0 } }}>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500, color: COLORS.onSurface }}>
                    {cat.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.onSurfaceVariant }}>
                    {cat.pct}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={cat.pct}
                  sx={{
                    height: 6,
                    borderRadius: 99,
                    bgcolor: COLORS.surfaceContainerHighest,
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 99,
                      bgcolor: cat.color,
                    },
                  }}
                />
              </Box>
            ))}
          </SectionCard>
        </Box>

        {/* Shared commitments */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: COLORS.onSurface, mb: 2, letterSpacing: "-0.01em" }}
          >
            Shared Commitments
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {friend.sharedGroups.map((g) => (
              <SectionCard key={g.name}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: COLORS.surfaceContainerLow,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.primary,
                      flexShrink: 0,
                    }}
                  >
                    <GroupsRoundedIcon fontSize="small" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: COLORS.onSurface }}
                    >
                      {g.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}
                    >
                      {g.members} members{g.dueDate ? ` · Due ${g.dueDate}` : ""}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: g.yourShare >= 0 ? COLORS.primary : COLORS.tertiary,
                      flexShrink: 0,
                    }}
                  >
                    {g.yourShare >= 0 ? "+" : "-"}{fmt(g.yourShare)}
                  </Typography>
                </Box>
              </SectionCard>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
