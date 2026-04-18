import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  Box,
  Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  FormHelperText,
} from "@mui/material";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { COLORS } from "@/theme";
import { loginSchema, loginInitialValues } from "@/logic/auth";
import { useAuth } from "@/context/AuthContext";
import type { LoginValues } from "@/logic/auth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik<LoginValues>({
    initialValues: loginInitialValues,
    validate(values) {
      const result = loginSchema.safeParse(values);
      if (result.success) return {};
      return Object.fromEntries(
        result.error.issues.map((i) => [i.path[0], i.message])
      );
    },
    async onSubmit(values, { setSubmitting }) {
      setServerError(null);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) {
          setServerError(data.error ?? "Login failed. Please try again.");
          return;
        }
        login(data.token, data.user);
        navigate("/dashboard", { replace: true });
      } catch {
        setServerError("Network error. Please check your connection.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        {/* Logo + title */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Box
            component="img"
            src="/assets/favicon-32x32.png"
            alt="DebtSense"
            sx={{ width: 48, height: 48, mb: 2, borderRadius: 2 }}
          />
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: COLORS.onSurface, letterSpacing: "-0.02em" }}
          >
            DebtSense
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.onSurfaceVariant, mt: 0.5 }}>
            Sign in to your account
          </Typography>
        </Box>

        {/* Card */}
        <Box
          sx={{
            bgcolor: COLORS.surfaceContainerLowest,
            borderRadius: 4,
            px: 4,
            py: 4,
            boxShadow: "0 20px 60px -5px rgba(22, 29, 25, 0.08)",
          }}
        >
          <form onSubmit={formik.handleSubmit} noValidate>
            {/* Email */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="caption"
                sx={{ color: COLORS.onSurfaceVariant, display: "block", mb: 1 }}
              >
                Email
              </Typography>
              <OutlinedInput
                id="email"
                type="email"
                fullWidth
                placeholder="you@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                startAdornment={
                  <InputAdornment position="start">
                    <MailOutlineRoundedIcon sx={{ fontSize: 18, color: COLORS.onSurfaceVariant }} />
                  </InputAdornment>
                }
                sx={{ height: 52 }}
              />
              {formik.touched.email && formik.errors.email && (
                <FormHelperText error sx={{ mx: 0, mt: 0.75 }}>
                  {formik.errors.email}
                </FormHelperText>
              )}
            </Box>

            {/* Password */}
            <Box sx={{ mb: 3.5 }}>
              <Typography
                variant="caption"
                sx={{ color: COLORS.onSurfaceVariant, display: "block", mb: 1 }}
              >
                Password
              </Typography>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                startAdornment={
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 18, color: COLORS.onSurfaceVariant }} />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword
                        ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                        : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{ height: 52 }}
              />
              {formik.touched.password && formik.errors.password && (
                <FormHelperText error sx={{ mx: 0, mt: 0.75 }}>
                  {formik.errors.password}
                </FormHelperText>
              )}
            </Box>

            {/* Server error */}
            {serverError && (
              <Box
                sx={{
                  bgcolor: COLORS.errorContainer,
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  mb: 2.5,
                }}
              >
                <Typography variant="body2" sx={{ color: COLORS.onErrorContainer }}>
                  {serverError}
                </Typography>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={formik.isSubmitting}
              sx={{ py: 1.75, fontWeight: 700, fontSize: "0.9375rem" }}
            >
              {formik.isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
