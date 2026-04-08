import { createTheme } from '@mui/material/styles'

// DebtSense design system — "The Fiscal Atelier"
// Sourced from Google Stitch project design theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0c56d0',
      light: '#dae2ff',
      dark: '#004aba',
      contrastText: '#f8f7ff',
    },
    secondary: {
      main: '#536073',
      light: '#d6e3fb',
      dark: '#475467',
      contrastText: '#f8f8ff',
    },
    error: {
      main: '#9f403d',
      light: '#fe8983',
      dark: '#4e0309',
      contrastText: '#fff7f6',
    },
    success: {
      main: '#006d4a',
      light: '#69f6b8',
      dark: '#005f40',
      contrastText: '#e6ffee',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2b3437',
      secondary: '#586064',
    },
    divider: 'rgba(171, 179, 183, 0.2)',
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Manrope", system-ui, sans-serif', fontWeight: 600 },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0c56d0 0%, #dae2ff 100%)',
          color: '#f8f7ff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 12px 40px rgba(43, 52, 55, 0.05)',
          border: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#f1f4f6',
          '& fieldset': { border: 'none' },
          '&:hover fieldset': { border: 'none' },
          '&.Mui-focused fieldset': {
            border: 'none',
            borderBottom: '2px solid #0c56d0',
            borderRadius: 0,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(248, 249, 250, 0.7)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'none',
          color: '#2b3437',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(171, 179, 183, 0.2)',
        },
      },
    },
  },
})

export default theme
