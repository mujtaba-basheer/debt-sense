import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Divider,
  LinearProgress,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { COLORS } from "@/theme";
import { fmt, fmtShort, CATEGORY_ICONS } from "@/utils";

// ─── Dummy data ────────────────────────────────────────────────────────────────

const STATS = {
  netBalance: 12450.8,
  netChange: 8.4,
  theyOweYou: 14220,
  youOweThem: 1770,
  pendingSettlements: 3,
};

const TOP_DEBTORS = [
  { id: "6", name: "Sarah Jenkins", initials: "SJ", amount: 1200, avatarColor: "#006c49", daysOverdue: 0 },
  { id: "7", name: "Alex Rivera", initials: "AR", amount: 450, avatarColor: "#376850", daysOverdue: 2 },
  { id: "1", name: "Julian Casablancas", initials: "JC", amount: 3240, avatarColor: "#005236", daysOverdue: 0 },
  { id: "4", name: "Elena Rodriguez", initials: "ER", amount: 8500, avatarColor: "#3c6c54", daysOverdue: 0 },
];

const RECENT_ACTIVITY = [
  {
    id: "a1",
    description: "Dinner at Le Bernardin",
    category: "dining" as const,
    friend: "Julian C.",
    date: "Today",
    amount: 118.2,
    positive: true,
  },
  {
    id: "a2",
    description: "Paris hotel split",
    category: "leisure" as const,
    friend: "Amelie P.",
    date: "Yesterday",
    amount: 490,
    positive: false,
  },
  {
    id: "a3",
    description: "Uber to airport",
    category: "transport" as const,
    friend: "Sarah J.",
    date: "Mar 30",
    amount: 19.9,
    positive: true,
  },
  {
    id: "a4",
    description: "Weekly groceries",
    category: "groceries" as const,
    friend: "Sarah J.",
    date: "Mar 30",
    amount: 71.9,
    positive: true,
  },
  {
    id: "a5",
    description: "Netflix split",
    category: "leisure" as const,
    friend: "Alex R.",
    date: "Apr 1",
    amount: 7.99,
    positive: true,
  },
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

// ─── Sub-components ────────────────────────────────────────────────────────────

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
      sx={{
        fontWeight: 700,
        color: COLORS.onSurface,
        letterSpacing: "-0.01em",
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );
}

function StatPill({
  label,
  value,
  positive,
}: {
  label: string;
  value: number;
  positive?: boolean;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: COLORS.surfaceContainerLowest,
        borderRadius: 3,
        px: 2.5,
        py: 2,
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
        variant="h6"
        sx={{
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color:
            positive === undefined
              ? COLORS.onSurface
              : positive
              ? COLORS.primary
              : COLORS.tertiary,
        }}
      >
        {fmtShort(value)}
      </Typography>
    </Box>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Box sx={{ maxWidth: 1100 }}>
      {/* ── Header ── */}
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

      {/* ── Hero balance card (glassmorphic / gradient) ── */}
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
        {/* Decorative circle */}
        <Box
          sx={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.06)",
            right: -80,
            top: -100,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.04)",
            right: 120,
            bottom: -80,
            pointerEvents: "none",
          }}
        />

        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.75)",
              textTransform: "none",
              letterSpacing: 0,
              display: "block",
              mb: 0.5,
            }}
          >
            Net Balance
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              mb: 1,
            }}
          >
            {fmt(STATS.netBalance)}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingUpRoundedIcon sx={{ fontSize: 16, color: COLORS.primaryFixedDim }} />
            <Typography
              variant="body2"
              sx={{ color: COLORS.primaryFixedDim, fontWeight: 600 }}
            >
              +{STATS.netChange}% from last month
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 4, position: "relative" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.65)", textTransform: "none", letterSpacing: 0 }}
            >
              They owe you
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}
            >
              {fmtShort(STATS.theyOweYou)}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 1,
              bgcolor: "rgba(255,255,255,0.2)",
              borderRadius: 99,
            }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.65)", textTransform: "none", letterSpacing: 0 }}
            >
              You owe them
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}
            >
              {fmtShort(STATS.youOweThem)}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 1,
              bgcolor: "rgba(255,255,255,0.2)",
              borderRadius: 99,
            }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.65)", textTransform: "none", letterSpacing: 0 }}
            >
              Pending
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}
            >
              {STATS.pendingSettlements}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Asymmetric 2-col layout ── */}
      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        {/* Left column (wide) */}
        <Box sx={{ flex: 2, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Recent activity */}
          <Card>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}
            >
              <SectionTitle>Recent Activity</SectionTitle>
              <Button
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  color: COLORS.primary,
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  p: 0,
                  "&:hover": { bgcolor: "transparent" },
                }}
                disableRipple
              >
                View all
              </Button>
            </Box>

            {RECENT_ACTIVITY.map((item, i) => (
              <Box key={item.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.75 }}>
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
                    {CATEGORY_ICONS[item.category]}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: COLORS.onSurface }}
                      noWrap
                    >
                      {item.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}
                    >
                      with {item.friend} · {item.date}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
                      {item.positive ? (
                        <TrendingUpRoundedIcon sx={{ fontSize: 14, color: COLORS.primary }} />
                      ) : (
                        <TrendingDownRoundedIcon sx={{ fontSize: 14, color: COLORS.tertiary }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: item.positive ? COLORS.primary : COLORS.tertiary,
                        }}
                      >
                        {item.positive ? "+" : "-"}{fmt(item.amount)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ color: COLORS.onSurfaceVariant, textTransform: "none", letterSpacing: 0 }}
                    >
                      your share
                    </Typography>
                  </Box>
                </Box>
                {i < RECENT_ACTIVITY.length - 1 && <Divider />}
              </Box>
            ))}
          </Card>

          {/* Monthly spending breakdown */}
          <Card>
            <SectionTitle>Monthly Spending Breakdown</SectionTitle>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {SPENDING_BREAKDOWN.map((cat) => (
                <Box key={cat.label}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: COLORS.onSurface }}
                    >
                      {cat.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: COLORS.onSurfaceVariant }}
                    >
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
            </Box>
          </Card>
        </Box>

        {/* Right column (narrow) */}
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Top debtors */}
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
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: d.avatarColor,
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {d.initials}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: COLORS.onSurface }}
                      noWrap
                    >
                      {d.name}
                    </Typography>
                    {d.daysOverdue > 0 && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTimeRoundedIcon sx={{ fontSize: 11, color: COLORS.tertiary }} />
                        <Typography
                          variant="caption"
                          sx={{ color: COLORS.tertiary, textTransform: "none", letterSpacing: 0 }}
                        >
                          {d.daysOverdue}d overdue
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: COLORS.primary, flexShrink: 0 }}
                  >
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
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: COLORS.onSurface, letterSpacing: "-0.01em" }}
              >
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
                  <Typography
                    variant="body2"
                    sx={{ color: COLORS.onSurface, lineHeight: 1.6 }}
                  >
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
                label={STATS.pendingSettlements}
                size="small"
                color="success"
                sx={{ height: 20, fontSize: "0.6875rem", mb: 2 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: COLORS.onSurfaceVariant }}>
              You have {STATS.pendingSettlements} unsettled balances waiting for confirmation.
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
    </Box>
  );
}
