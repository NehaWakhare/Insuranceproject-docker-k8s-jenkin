import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import SuperAdminProfile from "./SuperAdminProfile";
import SuperAdminSidebar from "./SuperAdminSidebar";
import AdminApproval from "./AdminApproval"; 
import AdminList from "./AdminList"; 
import {
  fetchAllAdmins,
  fetchPendingAdmins,
} from "../../api/superAdminApi";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    pending: 0,
    policies: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ Fetch Admins
        const admins = await fetchAllAdmins();
        const pending = await fetchPendingAdmins();

        // ⚠️ For now, mock users + policies count (until API confirmed)
        setStats({
          users: 120, // TODO: Replace with real API
          admins: admins.length,
          pending: pending.length,
          policies: 25, // TODO: Replace with real API
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <SuperAdminSidebar />

      {/* Main Content */}
      <div style={styles.main}>
        {/* 🔹 Topbar */}
        <div style={styles.topbar}>
          <h2 style={{ margin: 0 }}>Super Admin Dashboard</h2>
          <button
            style={styles.logoutBtn}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/superadmin/login";
            }}
          >
            Logout
          </button>
        </div>

        {/* 🔹 Routes + Dashboard Content */}
        <div style={styles.content}>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h2>Welcome, Super Admin!</h2>
                  {loading ? (
                    <p>Loading stats...</p>
                  ) : (
                    <div style={styles.cardGrid}>
                      <div style={styles.card}>
                        <h3>Total Users</h3>
                        <p>{stats.users}</p>
                      </div>
                      <div style={styles.card}>
                        <h3>Total Admins</h3>
                        <p>{stats.admins}</p>
                      </div>
                      <div style={styles.card}>
                        <h3>Pending Approvals</h3>
                        <p>{stats.pending}</p>
                      </div>
                      <div style={styles.card}>
                        <h3>Total Policies</h3>
                        <p>{stats.policies}</p>
                      </div>
                    </div>
                  )}
                </div>
              }
            />
            <Route path="profile" element={<SuperAdminProfile />} />
            <Route path="users" element={<h2>Manage Users (Coming Soon)</h2>} />
            <Route path="doctors" element={<h2>Manage Doctors (Coming Soon)</h2>} />
            <Route path="policies" element={<h2>Manage Policies (Coming Soon)</h2>} />
            <Route path="claims" element={<h2>Manage Claims (Coming Soon)</h2>} />
            <Route path="approvals" element={<AdminApproval />} />
            <Route path="admins" element={<AdminList />} />
            <Route path="logout" element={<h2>Logout Page (Coming Soon)</h2>} />
            <Route path="/superadmin/dashboard/admin-list" element={<AdminList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    background: "#007bff",
    color: "#fff",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutBtn: {
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  content: {
    flex: 1,
    padding: "20px",
    background: "#f4f6f8",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
};
