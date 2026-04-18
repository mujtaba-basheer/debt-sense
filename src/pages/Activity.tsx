import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Skeleton,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { COLORS } from "@/theme";
import { fmt, apiFetch } from "@/utils";
import TransactionRow from "@/components/TransactionRow";
import type { Transaction } from "@/types/transaction";

type ApiTransaction = Transaction & { friend_name: string };

interface Row {
  id: string;
  description: string;
  category: string;
  subtitle: string;
  amount: number;
  positive: boolean;
  status: "pending" | "settled";
}

function toRow(t: ApiTransaction): Row {
  const amount = parseFloat(t.amount);
  const parts = t.friend_name.trim().split(" ");
  const friendShort =
    parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
  const date = new Date(t.date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return {
    id: t.id,
    description: t.notes ?? "Transaction",
    category: t.category ?? "other",
    subtitle: `with ${friendShort} · ${date}`,
    amount,
    positive: t.type === "lent",
    status: t.status,
  };
}

const PAGE_SIZE = 10;

type Filter = "all" | "lent" | "borrowed";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Lent", value: "lent" },
  { label: "Borrowed", value: "borrowed" },
];

interface ApiResponse {
  transactions: ApiTransaction[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function Activity() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (filter !== "all") params.set("type", filter);
    apiFetch(`/api/transaction?${params}`)
      .then((res) => res.json() as Promise<ApiResponse>)
      .then(({ transactions, pages, total }) => {
        setRows(transactions.map(toRow));
        setTotalPages(Math.max(1, pages));
        setTotal(total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, filter]);

  // Reset to page 1 when filter changes
  useEffect(() => { setPage(1); }, [filter]);

  const paginated = rows;

  const [totalLent, setTotalLent] = useState(0);
  const [totalBorrowed, setTotalBorrowed] = useState(0);

  useEffect(() => {
    apiFetch("/api/transaction/summary")
      .then((res) => res.json() as Promise<{ total_lent: string; total_borrowed: string }>)
      .then(({ total_lent, total_borrowed }) => {
        setTotalLent(parseFloat(total_lent));
        setTotalBorrowed(parseFloat(total_borrowed));
      })
      .catch(() => {});
  }, []);

  return (
    <Box sx={{ maxWidth: { xs: "100%", md: 720 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: COLORS.onSurface, letterSpacing: "-0.02em" }}
        >
          Activity
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.onSurfaceVariant, mt: 0.5 }}>
          Your full transaction history
        </Typography>
      </Box>

      {/* Summary strip */}
      {!loading && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              bgcolor: `${COLORS.primary}10`,
              borderRadius: 2,
              p: 2,
              borderLeft: `3px solid ${COLORS.primary}`,
            }}
          >
            <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: COLORS.primary, mb: 0.5 }}>
              Pending lent
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: "1.125rem", color: COLORS.onSurface, letterSpacing: "-0.02em" }}>
              {fmt(totalLent)}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: `${COLORS.tertiary}10`,
              borderRadius: 2,
              p: 2,
              borderLeft: `3px solid ${COLORS.tertiary}`,
            }}
          >
            <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: COLORS.tertiary, mb: 0.5 }}>
              Pending borrowed
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: "1.125rem", color: COLORS.onSurface, letterSpacing: "-0.02em" }}>
              {fmt(totalBorrowed)}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Filter chips */}
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        {FILTERS.map(({ label, value }) => (
          <Chip
            key={value}
            label={label}
            onClick={() => setFilter(value)}
            sx={{
              fontWeight: 600,
              fontSize: "0.8125rem",
              bgcolor: filter === value ? COLORS.primary : COLORS.surfaceContainerLow,
              color: filter === value ? "#fff" : COLORS.onSurfaceVariant,
              "&:hover": {
                bgcolor: filter === value ? COLORS.primary : COLORS.surfaceContainerHigh,
              },
            }}
          />
        ))}
        <Typography
          variant="caption"
          sx={{ ml: "auto", alignSelf: "center", color: COLORS.onSurfaceVariant }}
        >
          {total} transactions
        </Typography>
      </Box>

      {/* Transaction list */}
      <Box
        sx={{
          bgcolor: COLORS.surfaceContainerLowest,
          borderRadius: 3,
          px: 3,
          py: 0.5,
          boxShadow: "0 12px 40px -5px rgba(22, 29, 25, 0.06)",
          mb: 3,
        }}
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.75 }}>
              <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: 2, flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="55%" height={18} />
                <Skeleton variant="text" width="40%" height={14} sx={{ mt: 0.25 }} />
              </Box>
              <Skeleton variant="text" width={72} height={18} />
            </Box>
          ))
        ) : paginated.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: COLORS.onSurfaceVariant }}>
              No transactions found.
            </Typography>
          </Box>
        ) : (
          paginated.map((row, i) => (
            <TransactionRow
              key={row.id}
              id={row.id}
              description={row.description}
              category={row.category}
              subtitle={row.subtitle}
              amount={row.amount}
              positive={row.positive}
              status={row.status}
              showDivider={i < paginated.length - 1}
            />
          ))
        )}
      </Box>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <Button
            size="small"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            sx={{ borderRadius: 2, color: COLORS.onSurfaceVariant, fontWeight: 600 }}
          >
            Prev
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Box
              key={p}
              onClick={() => setPage(p)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.875rem",
                bgcolor: p === page ? COLORS.primary : "transparent",
                color: p === page ? "#fff" : COLORS.onSurfaceVariant,
                "&:hover": { bgcolor: p === page ? COLORS.primary : COLORS.surfaceContainerHigh },
                transition: "background-color 0.15s ease",
              }}
            >
              {p}
            </Box>
          ))}

          <Button
            size="small"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            sx={{ borderRadius: 2, color: COLORS.onSurfaceVariant, fontWeight: 600 }}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
