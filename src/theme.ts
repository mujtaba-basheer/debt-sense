import { createTheme } from "@mui/material/styles";

// DebtSense design system — "Aeon Ledger / The Verdant Precision"
// Sourced from Google Stitch Aeon Ledger design system (assets/83fe62a0280f4857bf5f369af5fd8e91)
//
// Key rules:
//  - No 1px borders. Use surface tonal shifts for separation.
//  - Font: Manrope exclusively (display, headline, body, label)
//  - Primary CTA gradient: primary (#006c49) → primary_container (#10b981)
//  - Ambient shadow: blur 40px, rgba(22,29,25,0.06) — "Forest Shadow"
//  - Roundness: ROUND_FOUR (base 4px, large components 8px)

const COLORS = {
  primary: "#006c49",
  primaryContainer: "#10b981",
  primaryFixedDim: "#4edea3",
  onPrimary: "#ffffff",
  onPrimaryContainer: "#00422b",

  secondary: "#376850",
  secondaryContainer: "#b7ebce",
  onSecondary: "#ffffff",
  onSecondaryContainer: "#3c6c54",

  tertiary: "#a43a3a",
  tertiaryContainer: "#fc7c78",
  onTertiary: "#ffffff",
  onTertiaryContainer: "#711419",

  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onError: "#ffffff",
  onErrorContainer: "#93000a",

  surface: "#f4fbf4",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#eef6ee",
  surfaceContainer: "#e8f0e9",
  surfaceContainerHigh: "#e3eae3",
  surfaceContainerHighest: "#dde4dd",
  surfaceDim: "#d4dcd5",
  surfaceVariant: "#dde4dd",

  onSurface: "#161d19",
  onSurfaceVariant: "#3c4a42",
  outline: "#6c7a71",
  outlineVariant: "#bbcabf",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: COLORS.primary,
      light: COLORS.primaryContainer,
      dark: COLORS.onPrimaryContainer,
      contrastText: COLORS.onPrimary,
    },
    secondary: {
      main: COLORS.secondary,
      light: COLORS.secondaryContainer,
      dark: COLORS.onSecondaryContainer,
      contrastText: COLORS.onSecondary,
    },
    error: {
      main: COLORS.error,
      light: COLORS.errorContainer,
      contrastText: COLORS.onError,
    },
    success: {
      main: COLORS.primary,
      light: COLORS.primaryContainer,
      contrastText: COLORS.onPrimary,
    },
    warning: {
      main: COLORS.tertiary,
      light: COLORS.tertiaryContainer,
      contrastText: COLORS.onTertiary,
    },
    background: {
      default: COLORS.surface,       // #f4fbf4 — mint-white base
      paper: COLORS.surfaceContainerLowest, // #ffffff — floating elements
    },
    text: {
      primary: COLORS.onSurface,         // #161d19 — forest black
      secondary: COLORS.onSurfaceVariant, // #3c4a42
    },
    divider: `${COLORS.outlineVariant}26`, // 15% opacity
  },

  typography: {
    // Manrope exclusively per Aeon Ledger spec
    fontFamily: '"Manrope", system-ui, sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 600, letterSpacing: "-0.02em" },
    h4: { fontWeight: 600, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontSize: "0.875rem" },  // body-md as workhorse
    body2: { fontSize: "0.8125rem" },
    caption: {
      fontSize: "0.6875rem",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
  },

  shape: {
    borderRadius: 4, // ROUND_FOUR base; large components use 8px explicitly
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8, // lg roundedness per spec
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          // "Glass & Signature" gradient CTA
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryContainer} 100%)`,
          color: COLORS.onPrimary,
          "&:hover": {
            background: `linear-gradient(135deg, ${COLORS.onPrimaryContainer} 0%, ${COLORS.primary} 100%)`,
          },
        },
        containedSecondary: {
          backgroundColor: COLORS.surfaceContainerHigh,
          color: COLORS.onSurface,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          // Tonal layering — white card on mint bg = natural lift, no shadow needed
          backgroundColor: COLORS.surfaceContainerLowest,
          boxShadow: "none",
          border: "none",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        // Floating elements (modals, dropdowns) get "Forest Shadow"
        elevation1: {
          boxShadow: "0 12px 40px -5px rgba(22, 29, 25, 0.06)",
        },
        elevation2: {
          boxShadow: "0 20px 60px -5px rgba(22, 29, 25, 0.08)",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.surfaceContainerLow,
          borderRadius: 8,
          "& fieldset": { border: "none" },
          "&:hover fieldset": { border: "none" },
          // Ghost border bottom only on focus
          "&.Mui-focused": {
            borderBottom: `2px solid ${COLORS.primary}`,
            borderRadius: "8px 8px 0 0",
          },
          "&.Mui-focused fieldset": { border: "none" },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          // Glassmorphism nav per spec
          backgroundColor: "rgba(244, 251, 244, 0.7)",
          backdropFilter: "blur(20px)",
          boxShadow: "none",
          color: COLORS.onSurface,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 500,
        },
        colorSuccess: {
          backgroundColor: COLORS.primaryFixedDim,
          color: COLORS.onPrimaryContainer,
        },
        colorError: {
          backgroundColor: COLORS.errorContainer,
          color: COLORS.onErrorContainer,
        },
        colorWarning: {
          backgroundColor: COLORS.tertiaryContainer,
          color: COLORS.onTertiaryContainer,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: `${COLORS.outlineVariant}26`, // 15% opacity Ghost Border
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover": {
            backgroundColor: COLORS.surfaceContainerHigh,
          },
        },
      },
    },
  },
});

export default theme;

// Export raw tokens for use in sx props / styled components
export { COLORS };
