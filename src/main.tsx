import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import theme from './theme'
import App from './App'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} autoHideDuration={4000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
