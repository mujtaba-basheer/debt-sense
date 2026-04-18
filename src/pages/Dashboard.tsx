import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import CallMadeRoundedIcon from "@mui/icons-material/CallMadeRounded";
import CallReceivedRoundedIcon from "@mui/icons-material/CallReceivedRounded";
import { COLORS } from "@/theme";
import { fmt, fmtShort, CATEGORY_ICONS, apiFetch } from "@/utils";
import TransactionRow from "@/components/TransactionRow";
import type { Transaction } from "@/types/transaction";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Summary {
  net_balance: string;
  total_lent: string;
  total_borrowed: string;
}

type ApiTransaction = Transaction & { friend_name: string };

interface Activity {
  id: string;
  description: string;
  category: keyof typeof CATEGORY_ICONS;
  friend: string;
  date: string;
  amount: number;
  positive: boolean;
  status: "pending" | "settled";
}

function toActivity(t: ApiTransaction): Activity {
  const parts = t.friend_name.trim().split(" ");
  const friendShort = parts.length > 1
    ? `${parts[0]} ${parts[parts.length - 1][0]}.`
    : parts[0];

  const d = new Date(t.date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const dateLabel = isSameDay(d, today)
    ? "Today"
    : isSameDay(d, yesterday)
    ? "Yesterday"
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return {
    id: t.id,
    description: t.notes ?? "Transaction",
    category: (t.category ?? "other") as Activity["category"],
    friend: friendShort,
    date: dateLabel,
    amount: parseFloat(t.amount),
    positive: t.type === "lent",
    status: t.status,
  };
}

const TOP_DEBTORS = [
  { id: "6", name: "Sarah Jenkins", initials: "SJ", amount: 1200, avatarColor: "#006c49", daysOverdue: 0 },
  { id: "7", name: "Alex Rivera", initials: "AR", amount: 450, avatarColor: "#376850", daysOverdue: 2 },
  { id: "1", name: "Julian Casablancas", initials: "JC", amount: 3240, avatarColor: "#005236", daysOverdue: 0 },
  { id: "4", name: "Elena Rodriguez", initials: "ER", amount: 8500, avatarColor: "#3c6c54", daysOverdue: 0 },
];


const SMART_TIPS = [
  "Sarah Jenkins usually settles within 24 hrs — no need to send a reminder yet.",
  "You spent 34% more on dining this month compared to last month.",
  "Julian Casablancas has an outstanding balance for 12 days — consider a gentle nudge.",
];

const SPENDING_BREAKDOWN = [
  { label: "Dining", pct: 48, color: COLORS.primary },
  { label: "Transport", pct: 22, color: COLORS.secondary },
  { label: "Leisure", pct: 18, color: COLORS.primaryFixedDim },
  { label: "Shopping", pct: 12, color: COLORS.surfaceContainerHighest },
];

const QUICK_ACTIONS = [
  { label: "Add Debt", Icon: AddRoundedIcon, to: "/transactions/add" },
  { label: "Settle", Icon: SendRoundedIcon, to: "/friends" },
  { label: "Remind", Icon: NotificationsRoundedIcon, to: "/friends" },
  { label: "Insights", Icon: InsightsRoundedIcon, to: "/activity" },
];

// ─── Shared sub-components ─────────────────────────────────────────────────────

function Card({ children, sx = {} }: { children: React.ReactNode; sx?: object }) {
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="h6"
      sx={{ fontWeight: 700, color: COLORS.onSurface, letterSpacing: "-0.01em", mb: 2 }}
    >
      {children}
    </Typography>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [summary, setSummary] = useState<Summary>({ net_balance: "0", total_lent: "0", total_borrowed: "0" });
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    apiFetch("/api/transaction/summary")
      .then((res) => res.json() as Promise<Summary>)
      .then(setSummary)
      .catch(() => {});

    apiFetch("/api/transaction")
      .then((res) => res.json() as Promise<{ transactions: ApiTransaction[] }>)
      .then(({ transactions }) => setActivity(transactions.map(toActivity)))
      .catch(() => {});
  }, []);

  const netBalance = parseFloat(summary.net_balance);
  const theyOweYou = parseFloat(summary.total_lent);
  const youOweThem = parseFloat(summary.total_borrowed);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Split balance into integer and decimal for mobile big-number display
  const [balanceInt, balanceDec] = netBalance.toFixed(2).split(".");
  const balanceIntFormatted = Number(balanceInt).toLocaleString("en-IN");

  return (
    <Box sx={{ maxWidth: { xs: "100%", md: 1100 } }}>

      {/* ══════════════════════════════════════════
          DESKTOP ONLY — header + hero card
      ══════════════════════════════════════════ */}

      {!isMobile && (
        <>
          {/* Desktop header */}
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
                variant="caption"
                sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}
              >
                {today}
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: COLORS.onSurface, letterSpacing: "-0.02em", mt: 0.25 }}
              >
                Good morning, Mujtaba
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => navigate("/transactions/add")}
              sx={{ borderRadius: 2, px: 2.5, mt: 0.5 }}
            >
              Add Transaction
            </Button>
          </Box>

          {/* Desktop hero gradient card */}
          <Box
            sx={{
              borderRadius: 4,
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryContainer} 100%)`,
              px: 4,
              py: 3.5,
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 60px -5px rgba(0, 108, 73, 0.3)",
            }}
          >
            <Box sx={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.06)", right: -80, top: -100, pointerEvents: "none" }} />
            <Box sx={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)", right: 120, bottom: -80, pointerEvents: "none" }} />

            <Box>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)", textTransform: "none", letterSpacing: 0, display: "block", mb: 0.5 }}>
                Net Balance
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, mb: 1 }}>
                {fmt(netBalance)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 4, position: "relative", flexShrink: 0 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)", textTransform: "none", letterSpacing: 0, whiteSpace: "nowrap", display: "block" }}>
                  They owe you
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                  {fmtShort(theyOweYou)}
                </Typography>
              </Box>
              <Box sx={{ width: 1, bgcolor: "rgba(255,255,255,0.2)", borderRadius: 99 }} />
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)", textTransform: "none", letterSpacing: 0, whiteSpace: "nowrap", display: "block" }}>
                  You owe them
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                  {fmtShort(youOweThem)}
                </Typography>
              </Box>
              <Box sx={{ width: 1, bgcolor: "rgba(255,255,255,0.2)", borderRadius: 99 }} />
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)", textTransform: "none", letterSpacing: 0, whiteSpace: "nowrap", display: "block" }}>
                  Pending
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                  {0}
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      )}

      {/* ══════════════════════════════════════════
          MOBILE ONLY — flat hero + bento + actions
      ══════════════════════════════════════════ */}

      {isMobile && (
        <>
          {/* Mobile hero — flat, big number */}
          <Box sx={{ mb: 4, mt: 1 }}>
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: COLORS.outline,
                mb: 0.5,
              }}
            >
              Total Balance
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.25, mb: 2 }}>
              <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: COLORS.onSurface, lineHeight: 1 }}>
                ₹
              </Typography>
              <Typography sx={{ fontSize: "2.75rem", fontWeight: 800, letterSpacing: "-0.03em", color: COLORS.onSurface, lineHeight: 1 }}>
                {balanceIntFormatted}
              </Typography>
              <Typography sx={{ fontSize: "1.375rem", fontWeight: 700, color: COLORS.outline, lineHeight: 1 }}>
                .{balanceDec}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.5,
                py: 0.5,
                bgcolor: `${COLORS.primaryContainer}1a`,
                borderRadius: 99,
              }}
            >
              <TrendingUpRoundedIcon sx={{ fontSize: 16, color: COLORS.primaryContainer }} />
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: COLORS.onPrimaryContainer }}>
                +{0}% from last month
              </Typography>
            </Box>
          </Box>

          {/* Mobile bento — owed vs you owe */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 4 }}>
            {/* Owed to You — green */}
            <Box
              sx={{
                bgcolor: COLORS.primaryContainer,
                borderRadius: 2,
                p: 2.5,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CallMadeRoundedIcon
                sx={{
                  position: "absolute",
                  right: -12,
                  top: -12,
                  fontSize: 88,
                  color: "rgba(255,255,255,0.10)",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.80)",
                  mb: 2,
                  display: "block",
                }}
              >
                Owed to you
              </Typography>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                {fmtShort(theyOweYou)}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.90)", mt: 0.5 }}>
                {TOP_DEBTORS.length} people owe you
              </Typography>
            </Box>

            {/* You Owe — light */}
            <Box
              sx={{
                bgcolor: COLORS.surfaceContainerLow,
                borderRadius: 2,
                p: 2.5,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CallReceivedRoundedIcon
                sx={{
                  position: "absolute",
                  right: -12,
                  top: -12,
                  fontSize: 88,
                  color: `${COLORS.onSurface}08`,
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: COLORS.outline,
                  mb: 2,
                  display: "block",
                }}
              >
                You owe
              </Typography>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: COLORS.onSurface, letterSpacing: "-0.02em" }}>
                {fmtShort(youOweThem)}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: COLORS.onSurfaceVariant, mt: 0.5 }}>
                {0} pending payments
              </Typography>
            </Box>
          </Box>

          {/* Quick action bar — horizontal scroll */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              mb: 4,
              overflowX: "auto",
              mx: -3,
              px: 3,
              pb: 0.5,
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {QUICK_ACTIONS.map(({ label, Icon, to }) => (
              <Box
                key={label}
                onClick={() => navigate(to)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: COLORS.surfaceContainerHighest,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.15s ease",
                    "&:hover": { bgcolor: COLORS.primaryContainer, "& svg": { color: "#fff !important" } },
                  }}
                >
                  <Icon sx={{ color: COLORS.primaryContainer, fontSize: 24 }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: COLORS.onSurfaceVariant,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* ══════════════════════════════════════════
          DESKTOP 2-col  /  MOBILE single-col
      ══════════════════════════════════════════ */}

      {isMobile ? (
        /* ── Mobile single-column content ── */
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Recent Activity */}
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography
                sx={{ fontWeight: 800, fontSize: "1.125rem", letterSpacing: "-0.02em", color: COLORS.onSurface }}
              >
                Recent Activity
              </Typography>
              <Button
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{ color: COLORS.primary, fontWeight: 700, fontSize: "0.875rem", p: 0, "&:hover": { bgcolor: "transparent" } }}
                disableRipple
              >
                See All
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {activity.slice(0, 4).map((item) => (
                <TransactionRow
                  key={item.id}
                  id={item.id}
                  description={item.description}
                  category={item.category}
                  subtitle={`with ${item.friend} · ${item.date}`}
                  amount={item.amount}
                  positive={item.positive}
                  status={item.status}
                  amountLabel={item.date}
                  iconSize={48}
                  positiveColor={COLORS.primaryContainer}
                  negativeColor={COLORS.onSurface}
                />
              ))}
            </Box>
          </Box>
        </Box>
      ) : (
        /* ── Desktop 2-column layout ── */
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          {/* Left column (wide) */}
          <Box sx={{ flex: 2, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Recent Activity */}
            <Card>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <SectionTitle>Recent Activity</SectionTitle>
                <Button
                  endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                  sx={{ color: COLORS.primary, fontWeight: 600, fontSize: "0.8125rem", p: 0, "&:hover": { bgcolor: "transparent" } }}
                  disableRipple
                >
                  View all
                </Button>
              </Box>
              {activity.map((item, i) => (
                <TransactionRow
                  key={item.id}
                  id={item.id}
                  description={item.description}
                  category={item.category}
                  subtitle={`with ${item.friend} · ${item.date}`}
                  amount={item.amount}
                  positive={item.positive}
                  status={item.status}
                  showTrendIcon
                  showDivider={i < activity.length - 1}
                />
              ))}
            </Card>

            {/* Monthly spending breakdown */}
            <Card>
              <SectionTitle>Monthly Spending Breakdown</SectionTitle>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {SPENDING_BREAKDOWN.map((cat) => (
                  <Box key={cat.label}>
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
              </Box>
            </Card>
          </Box>

          {/* Right column (narrow) */}
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Top balances */}
            <Box>
              <SectionTitle>Top Balances</SectionTitle>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {TOP_DEBTORS.map((d) => (
                  <Box
                    key={d.id}
                    onClick={() => navigate(`/friends/${d.id}`)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      bgcolor: COLORS.surfaceContainerLowest,
                      borderRadius: 3,
                      px: 2,
                      py: 1.5,
                      cursor: "pointer",
                      boxShadow: "0 12px 40px -5px rgba(22, 29, 25, 0.06)",
                      transition: "background-color 0.15s ease",
                      "&:hover": { bgcolor: COLORS.surfaceContainer },
                    }}
                  >
                    <Avatar sx={{ width: 36, height: 36, bgcolor: d.avatarColor, color: "#fff", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
                      {d.initials}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.onSurface }} noWrap>
                        {d.name}
                      </Typography>
                      {d.daysOverdue > 0 && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <AccessTimeRoundedIcon sx={{ fontSize: 11, color: COLORS.tertiary }} />
                          <Typography variant="caption" sx={{ color: COLORS.tertiary, textTransform: "none", letterSpacing: 0 }}>
                            {d.daysOverdue}d overdue
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.primary, flexShrink: 0 }}>
                      +{fmtShort(d.amount)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Smart tips */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <LightbulbRoundedIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.onSurface, letterSpacing: "-0.01em" }}>
                  Smart Tips
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {SMART_TIPS.map((tip, i) => (
                  <Box
                    key={i}
                    sx={{
                      bgcolor: COLORS.surfaceContainerLowest,
                      borderRadius: 3,
                      px: 2.5,
                      py: 2,
                      boxShadow: "0 12px 40px -5px rgba(22, 29, 25, 0.06)",
                      borderLeft: `3px solid ${COLORS.primaryContainer}`,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: COLORS.onSurface, lineHeight: 1.6 }}>
                      {tip}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Pending settlements */}
            <Card>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                <SectionTitle>Pending Settlements</SectionTitle>
                <Chip
                  label={0}
                  size="small"
                  color="success"
                  sx={{ height: 20, fontSize: "0.6875rem", mb: 2 }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: COLORS.onSurfaceVariant }}>
                You have {0} unsettled balances waiting for confirmation.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2, borderRadius: 2 }}
                onClick={() => navigate("/friends")}
              >
                Review &amp; Settle
              </Button>
            </Card>
          </Box>
        </Box>
      )}

      {/* ── Mobile FAB ── */}
      {isMobile && (
        <Box
          onClick={() => navigate("/transactions/add")}
          sx={{
            position: "fixed",
            bottom: 96,
            right: 24,
            zIndex: 40,
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: COLORS.primaryContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0, 108, 73, 0.35)",
            transition: "transform 0.15s ease",
            "&:active": { transform: "scale(0.93)" },
          }}
        >
          <AddRoundedIcon sx={{ color: "#fff", fontSize: 28 }} />
        </Box>
      )}
    </Box>
  );
}
