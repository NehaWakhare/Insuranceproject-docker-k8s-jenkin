import React from "react";
import { Routes, Route } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminNavbar from "./SuperAdminNavbar";


// Example placeholder pages (you can replace with your real pages)
function DashboardHome() {
  return <h2>📊 Super Admin Dashboard Overview</h2>;
}
function UsersPage() {
  return <h2>👥 Manage Users</h2>;
}
function AdminsPage() {
  return <h2>🛡 Manage Admins</h2>;
}
function DoctorsPage() {
  return <h2>⚕ Manage Doctors</h2>;
}
function PoliciesPage() {
  return <h2>📄 Manage Policies</h2>;
}
function ClaimsPage() {
  return <h2>💰 Manage Claims</h2>;
}
function ApprovalsPage() {
  return <h2>✅ Approvals</h2>;
}
function LogoutPage() {
  return <h2>🚪 You have been logged out</h2>;
}

export default function SuperAdminDashboard() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <SuperAdminSidebar />

      {/* Main Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Navbar */}
        <SuperAdminNavbar />

        {/* Page Content */}
        <div style={{ flex: 1, padding: "20px", backgroundColor: "#f9fafb" }}>
          <Routes>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/users" element={<UsersPage />} />
            <Route path="/dashboard/admins" element={<AdminsPage />} />
            <Route path="/dashboard/doctors" element={<DoctorsPage />} />
            <Route path="/dashboard/policies" element={<PoliciesPage />} />
            <Route path="/dashboard/claims" element={<ClaimsPage />} />
            <Route path="/dashboard/approvals" element={<ApprovalsPage />} />
            <Route path="/dashboard/logout" element={<LogoutPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
