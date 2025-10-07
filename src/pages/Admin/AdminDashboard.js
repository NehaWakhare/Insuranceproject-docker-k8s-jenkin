import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminProfileForm from "./AdminProfile";
import AdminAddPolicy from "./AdminAddPolicy";
import AdminViewPolicy from "./AdminViewPolicy";
import UsersPage from "./AdminUsers"; 
import { getDashboardStats } from "../AdminAPI/AdminDashboard";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPolicies: 0,
    activeUsers: 0,
    pendingClaims: 0,
    approvedClaims: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  const cards = [
    { title: "Total Policies", value: stats.totalPolicies, color: "#3498db" },
    { title: "Active Users", value: stats.activeUsers, color: "#2ecc71" },
    { title: "Pending Claims", value: stats.pendingClaims, color: "#e67e22" },
    { title: "Approved Claims", value: stats.approvedClaims, color: "#9b59b6" },
  ];

  return (
    <div>
      {/* Sidebar (fixed) */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={styles.main}>
        <AdminNavbar />

        <div style={styles.content}>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1>Welcome, Admin!</h1>
                  <div style={styles.cardGrid}>
                    {cards.map((card) => (
                      <div
                        key={card.title}
                        style={{ ...styles.card, borderTop: `7px solid ${card.color}` }}
                      >
                        <h3>{card.title}</h3>
                        <p>{card.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              }
            />
            <Route path="profile" element={<AdminProfileForm />} />
            <Route path="add-policy" element={<AdminAddPolicy />} />
            <Route path="view-policies" element={<AdminViewPolicy />} />
            <Route path="users" element={<UsersPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

const styles = {
  main: {
    marginLeft: "240px", 
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  content: {
    padding: "20px",
    backgroundColor: "#f4f6f8",
    minHeight: "calc(100vh - 60px)",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
};
