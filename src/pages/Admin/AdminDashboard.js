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
    { title: "Total Policies", value: stats.totalPolicies, color: "#42a5f5" },
    { title: "Active Users", value: stats.activeUsers, color: "#42a5f5" },
    { title: "Pending Claims", value: stats.pendingClaims, color: "#42a5f5" },
    { title: "Approved Claims", value: stats.approvedClaims, color: "#42a5f5" },
  ];

  return (
    <div>
      <AdminSidebar />
      <div style={styles.main}>
        <AdminNavbar />
        <div style={styles.content}>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <div style={styles.cardGrid}>
                    {cards.map((card) => (
                      <div
                        key={card.title}
                        style={{
                          ...styles.card,
                          borderTop: `6px solid ${card.color}`,
                        }}
                      >
                        <h3 style={styles.cardTitle}>{card.title}</h3>
                        <p style={styles.cardValue}>{card.value}</p>
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
    height: "100vh", 
    background: "linear-gradient(180deg, rgba(247, 247, 247, 1) 0%, rgba(247, 247, 247, 1) 0%",
  },
  content: {
    padding: "30px",
    flexGrow: 1,
    overflowY: "auto", // enable scrolling
  },




  heading: {
    color: "#0d47a1",
    fontSize: "26px",
    marginBottom: "20px",
    textAlign: "center",
    letterSpacing: "0.5px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "25px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "30px 20px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  cardTitle: {
    fontSize: "18px",
    color: "#000000ff",
    marginBottom: "10px",
  },
  cardValue: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#000000ff",
  },
};
