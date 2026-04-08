import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import FriendsList from "@/pages/FriendsList";
import FriendStatement from "@/pages/FriendStatement";
import AddTransaction from "@/pages/AddTransaction";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/friends" element={<FriendsList />} />
        <Route path="/friends/:friendId" element={<FriendStatement />} />
        <Route path="/transactions/add" element={<AddTransaction />} />
      </Route>
    </Routes>
  );
}
