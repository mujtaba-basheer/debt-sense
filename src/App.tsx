import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import FriendsList from "@/pages/FriendsList";
import FriendStatement from "@/pages/FriendStatement";
import AddTransaction from "@/pages/AddTransaction";
import Activity from "@/pages/Activity";
import Login from "@/pages/Login";
import { useAuth } from "@/context/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/friends" element={<FriendsList />} />
        <Route path="/friends/:friendId" element={<FriendStatement />} />
        <Route path="/transactions/add" element={<AddTransaction />} />
        <Route path="/activity" element={<Activity />} />
      </Route>
    </Routes>
  );
}
