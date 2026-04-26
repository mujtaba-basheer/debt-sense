import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

export type UserRole = "admin" | "viewer";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "ds_token";
const USER_KEY = "ds_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  function login(newToken: string, newUser: AuthUser) {
    setToken(newToken);
    setUser(newUser);
  }

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    function handleSessionExpired() {
      logout();
      navigate("/login", { replace: true });
      enqueueSnackbar("Your session has expired. Please log in again.", { variant: "warning" });
    }
    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, [logout, navigate]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
