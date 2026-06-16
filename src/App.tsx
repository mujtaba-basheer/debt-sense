import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import FriendsList from "@/pages/FriendsList";
import FriendStatement from "@/pages/FriendStatement";
import AddTransaction from "@/pages/AddTransaction";
import EditTransaction from "@/pages/EditTransaction";
import Activity from "@/pages/Activity";
import Login from "@/pages/Login";
import { useAuth } from "@/context/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  if (user?.friend_id) {
    const allowed = `/friends/${user.friend_id}`;
    if (location.pathname !== allowed) return <Navigate to={allowed} replace />;
  }

  return <>{children}</>;
}

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user?.friend_id ? `/friends/${user.friend_id}` : "/dashboard"} replace />;
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
        <Route path="/" element={<RootRedirect />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/friends" element={<FriendsList />} />
        <Route path="/friends/:friendId" element={<FriendStatement />} />
        <Route path="/transactions/add" element={<AddTransaction />} />
        <Route path="/transactions/:id/edit" element={<EditTransaction />} />
        <Route path="/activity" element={<Activity />} />
      </Route>
    </Routes>
  );
}
