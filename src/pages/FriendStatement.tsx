import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { COLORS } from "@/theme";
import { fmt, apiFetch } from "@/utils";
import TransactionRow from "@/components/TransactionRow";
import DeleteFriendModal from "@/components/DeleteFriendModal";
import type { Friend as ApiFriend } from "@/types/friend";
import type { Transaction as ApiTransaction } from "@/types/transaction";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  description: string;
  category: "dining" | "transport" | "leisure" | "shopping" | "groceries";
  date: string;
  total: number;
  yourShare: number; // positive = they owe you, negative = you owe them
  status: "pending" | "settled";
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

// ─── Static placeholder data (until transactions table exists) ─────────────────

const STATIC_PLACEHOLDER: Pick<
  FriendData,
  "balanceChange" | "trustLevel" | "trustStreak" | "friendSince" | "totalTransactions" | "transactions" | "sharedGroups" | "categoryBreakdown"
> = {
  balanceChange: 0,
  trustLevel: "New",
  trustStreak: "No transactions yet",
  friendSince: "—",
  totalTransactions: 0,
  transactions: [],
  sharedGroups: [],
  categoryBreakdown: [],
};

// ─── API → local shape mapper ──────────────────────────────────────────────────

function toFriendData(f: ApiFriend): FriendData {
  return {
    id: f.id,
    name: f.name,
    initials: f.initials,
    avatarColor: f.avatar_color,
    group: f.relation,
    balance: 0,
    ...STATIC_PLACEHOLDER,
  };
}

function toLocalTransaction(t: ApiTransaction): Transaction {
  const amount = parseFloat(t.amount);
  return {
    id: t.id,
    description: t.notes ?? "Transaction",
    category: (t.category ?? "other") as Transaction["category"],
    date: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    total: amount,
    yourShare: t.type === "lent" ? amount : -amount,
    status: t.status,
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const TRUST_COLORS: Record<FriendData["trustLevel"], string> = {
  Elite: COLORS.primary,
  Trusted: COLORS.secondary,
  New: COLORS.onSurfaceVariant,
};

// ─── Shared sub-components ─────────────────────────────────────────────────────


function SectionCard({ children, sx = {} }: { children: React.ReactNode; sx?: object }) {
  return (
    <Box
      sx={{
        bgcolor: COLORS.surfaceContainerLowest,
        borderRadius: 3,
        px: 3,
        py: 2.5,
        boxShadow: "0 12px 40px -5px rgba(22, 29, 25, 0.06)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function ExpenseBreakdown({ friend }: { friend: FriendData }) {
  return (
    <>
      {friend.categoryBreakdown.map((cat) => (
        <Box key={cat.label} sx={{ mb: 2.5, "&:last-child": { mb: 0 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
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
              "& .MuiLinearProgress-bar": { borderRadius: 99, bgcolor: cat.color },
            }}
          />
        </Box>
      ))}
    </>
  );
}

function SharedCommitmentCard({ g }: { g: SharedGroup }) {
  return (
    <SectionCard>
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
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.onSurface }}>
            {g.name}
          </Typography>
          <Typography variant="caption" sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}>
            {g.members} members{g.dueDate ? ` · Due ${g.dueDate}` : ""}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: g.yourShare >= 0 ? COLORS.primary : COLORS.tertiary, flexShrink: 0 }}
        >
          {g.yourShare >= 0 ? "+" : "-"}{fmt(g.yourShare)}
        </Typography>
      </Box>
    </SectionCard>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FriendStatement() {
  const { friendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [friend, setFriend] = useState<FriendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!friendId) return;

    const friendPromise = apiFetch(`/api/friend/${friendId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Friend not found");
        return res.json() as Promise<{ friend: ApiFriend }>;
      });

    const txPromise = apiFetch(`/api/transaction/friend/${friendId}`)
      .then((res) => res.json() as Promise<{ transactions: ApiTransaction[] }>);

    const summaryPromise = apiFetch(`/api/transaction/friend/${friendId}/summary`)
      .then((res) => res.json() as Promise<{ total_lent: string; total_borrowed: string }>);

    Promise.all([friendPromise, txPromise, summaryPromise])
      .then(([friendData, txData, summary]) => {
        const mapped = toFriendData(friendData.friend);
        mapped.transactions = txData.transactions.map(toLocalTransaction);
        mapped.totalTransactions = txData.transactions.length;
        mapped.balance = parseFloat(summary.total_lent) - parseFloat(summary.total_borrowed);
        setFriend(mapped);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [friendId]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: { xs: "100%", md: 720 } }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/friends")}
          sx={{ mb: 3, color: COLORS.onSurfaceVariant, fontWeight: 500, px: 0, "&:hover": { bgcolor: "transparent" } }}
          disableRipple
        >
          Friends
        </Button>
        {[120, 80, 80].map((h, i) => (
          <Box
            key={i}
            sx={{
              height: h,
              borderRadius: 3,
              bgcolor: COLORS.surfaceContainerLowest,
              mb: 2,
              animation: "pulse 1.5s ease-in-out infinite",
              "@keyframes pulse": { "0%, 100%": { opacity: 1 }, "50%": { opacity: 0.4 } },
            }}
          />
        ))}
      </Box>
    );
  }

  if (error || !friend) {
    return (
      <Box sx={{ maxWidth: { xs: "100%", md: 720 } }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/friends")}
          sx={{ mb: 3, color: COLORS.onSurfaceVariant, fontWeight: 500, px: 0, "&:hover": { bgcolor: "transparent" } }}
          disableRipple
        >
          Friends
        </Button>
        <Box sx={{ py: 8, textAlign: "center", bgcolor: COLORS.surfaceContainerLowest, borderRadius: 3 }}>
          <Typography variant="body1" sx={{ color: COLORS.tertiary }}>
            {error ?? "Friend not found"}
          </Typography>
        </Box>
      </Box>
    );
  }

  const isPositive = friend.balance >= 0;

  // Format balance as split int + decimal for mobile large display
  const absBalance = Math.abs(friend.balance);
  const [balInt, balDec] = absBalance.toFixed(2).split(".");
  const balanceIntFormatted = Number(balInt).toLocaleString("en-IN");

  return (
    <Box sx={{ maxWidth: { xs: "100%", md: 720 } }}>

      {/* Back button */}
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

      {isMobile ? (
        /* ══════════════════════════════════════════
           MOBILE — single column
        ══════════════════════════════════════════ */
        <>
          {/* Centered profile (no card bg) */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
            <Box sx={{ position: "relative", mb: 2 }}>
              <Avatar
                sx={{
                  width: 88,
                  height: 88,
                  borderRadius: "20px",
                  bgcolor: friend.avatarColor,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  boxShadow: "0 8px 24px rgba(22,29,25,0.10)",
                }}
              >
                {friend.initials}
              </Avatar>
              {/* Trust badge */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -8,
                  right: -8,
                  bgcolor: COLORS.primaryContainer,
                  color: "#fff",
                  borderRadius: "6px",
                  p: 0.75,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <WorkspacePremiumRoundedIcon sx={{ fontSize: 14 }} />
              </Box>
            </Box>

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.375rem",
                letterSpacing: "-0.025em",
                color: COLORS.onSurface,
                mb: 0.5,
                textAlign: "center",
              }}
            >
              {friend.name}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: COLORS.secondary,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                textAlign: "center",
              }}
            >
              Active since {friend.friendSince}
            </Typography>
          </Box>

          {/* Balance card */}
          <Box
            sx={{
              bgcolor: COLORS.surfaceContainerLowest,
              borderRadius: "24px",
              p: 3.5,
              mb: 3,
              boxShadow: "0 12px 40px -5px rgba(22, 29, 25, 0.06)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative blur blob */}
            <Box
              sx={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 120,
                height: 120,
                borderRadius: "50%",
                bgcolor: `${COLORS.primaryContainer}0d`,
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />

            <Typography
              sx={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: COLORS.outline,
                display: "block",
                mb: 1,
              }}
            >
              {isPositive ? "You are owed" : "You owe"}
            </Typography>

            {/* Large split amount */}
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.25, mb: 1.5 }}>
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: isPositive ? COLORS.primary : COLORS.tertiary,
                  lineHeight: 1,
                }}
              >
                ₹
              </Typography>
              <Typography
                sx={{
                  fontSize: "3.25rem",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: COLORS.onSurface,
                  lineHeight: 1,
                }}
              >
                {balanceIntFormatted}
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: COLORS.outline,
                  lineHeight: 1,
                }}
              >
                .{balDec}
              </Typography>
            </Box>

            {friend.totalTransactions === 0 && (
              <Typography
                variant="caption"
                sx={{
                  color: COLORS.primary,
                  textTransform: "none",
                  letterSpacing: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 3,
                }}
              >
                <WorkspacePremiumRoundedIcon sx={{ fontSize: 13 }} />
                {friend.trustStreak}
              </Typography>
            )}

            {/* Side-by-side action buttons */}
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                variant="contained"
                startIcon={<CheckCircleRoundedIcon />}
                sx={{ flex: 1, py: 1.75, borderRadius: 2, fontWeight: 700 }}
              >
                Settle Up
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteOutlineRoundedIcon />}
                onClick={() => setDeleteOpen(true)}
                sx={{
                  flex: 1,
                  py: 1.75,
                  borderRadius: 2,
                  fontWeight: 700,
                  borderColor: `${COLORS.error}44`,
                  color: COLORS.error,
                  "&:hover": { borderColor: COLORS.error, bgcolor: COLORS.errorContainer },
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>

          {/* Recent Transactions */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.onSurface, mb: 2, letterSpacing: "-0.01em" }}>
              Recent Transactions
            </Typography>
            <SectionCard>
              {friend.transactions.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{ color: COLORS.onSurfaceVariant, textAlign: "center", py: 3 }}
                >
                  No transactions with {friend.name} yet.
                </Typography>
              ) : (
                friend.transactions.map((tx: Transaction, i: number) => (
                  <TransactionRow
                    key={tx.id}
                    id={tx.id}
                    description={tx.description}
                    category={tx.category}
                    subtitle={`${tx.date} · Total ${fmt(tx.total)}`}
                    amount={Math.abs(tx.yourShare)}
                    positive={tx.yourShare > 0}
                    iconSize={40}
                    status={tx.status}
                    showDivider={i < friend.transactions.length - 1}
                  />
                ))
              )}
            </SectionCard>
          </Box>

          {/* Expense Breakdown — full width */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.onSurface, mb: 2, letterSpacing: "-0.01em" }}>
              Expense Breakdown
            </Typography>
            <SectionCard>
              <ExpenseBreakdown friend={friend} />
            </SectionCard>
          </Box>

          {/* Shared Commitments — full width */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.onSurface, mb: 2, letterSpacing: "-0.01em" }}>
              Shared Commitments
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {friend.sharedGroups.map((g: SharedGroup) => (
                <SharedCommitmentCard key={g.name} g={g} />
              ))}
            </Box>
          </Box>
        </>
      ) : (
        /* ══════════════════════════════════════════
           DESKTOP — unchanged layout
        ══════════════════════════════════════════ */
        <>
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
                  <Typography variant="h5" sx={{ fontWeight: 700, color: COLORS.onSurface, letterSpacing: "-0.02em" }}>
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

            <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" sx={{ color: COLORS.onSurfaceVariant, display: "block", mb: 0.5 }}>
                  {isPositive ? "They owe you" : "You owe them"}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: isPositive ? COLORS.primary : COLORS.tertiary, letterSpacing: "-0.03em" }}
                >
                  {fmt(friend.balance)}
                </Typography>
                {friend.totalTransactions === 0 && (
                  <Typography
                    variant="caption"
                    sx={{ color: COLORS.primary, textTransform: "none", letterSpacing: 0, display: "flex", alignItems: "center", gap: 0.5, mt: 0.75 }}
                  >
                    <WorkspacePremiumRoundedIcon sx={{ fontSize: 13 }} />
                    {friend.trustStreak}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={() => setDeleteOpen(true)}
                  sx={{
                    borderRadius: 2,
                    borderColor: `${COLORS.error}44`,
                    color: COLORS.error,
                    fontWeight: 500,
                    "&:hover": { borderColor: COLORS.error, bgcolor: COLORS.errorContainer },
                  }}
                >
                  Delete
                </Button>
                <Button variant="contained" startIcon={<CheckCircleRoundedIcon />} sx={{ borderRadius: 2 }}>
                  Settle Up
                </Button>
              </Box>
            </Box>
          </SectionCard>

          {/* Recent transactions */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.onSurface, mb: 2, letterSpacing: "-0.01em" }}>
              Recent Transactions
            </Typography>
            <SectionCard>
              {friend.transactions.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{ color: COLORS.onSurfaceVariant, textAlign: "center", py: 3 }}
                >
                  No transactions with {friend.name} yet.
                </Typography>
              ) : (
                friend.transactions.map((tx: Transaction, i: number) => (
                  <TransactionRow
                    key={tx.id}
                    id={tx.id}
                    description={tx.description}
                    category={tx.category}
                    subtitle={`${tx.date} · Total ${fmt(tx.total)}`}
                    amount={Math.abs(tx.yourShare)}
                    positive={tx.yourShare > 0}
                    iconSize={40}
                    status={tx.status}
                    showDivider={i < friend.transactions.length - 1}
                  />
                ))
              )}
            </SectionCard>
          </Box>

          {/* Bottom row: breakdown + shared groups */}
          <Box sx={{ display: "flex", gap: 3, mt: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.onSurface, mb: 2, letterSpacing: "-0.01em" }}>
                Expense Breakdown
              </Typography>
              <SectionCard>
                <ExpenseBreakdown friend={friend} />
              </SectionCard>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.onSurface, mb: 2, letterSpacing: "-0.01em" }}>
                Shared Commitments
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {friend.sharedGroups.map((g) => (
                  <SharedCommitmentCard key={g.name} g={g} />
                ))}
              </Box>
            </Box>
          </Box>
        </>
      )}

      <DeleteFriendModal
        open={deleteOpen}
        friendId={friend.id}
        friendName={friend.name}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => navigate("/friends")}
      />
    </Box>
  );
}
