import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SuperAdminProfile from "./SuperAdminProfile";
import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminAdmins from "./Admins/SuperAdminAdmins";
import { fetchAllAdmins, fetchPendingAdmins } from "../../api/superAdminApi";
import SuperAdminDoctors from "./Doctors/SuperAdminDoctors";
import DoctorDetails from "./Doctors/DoctorDetails";
import SuperAdminFAQs from "./FAQs/SuperAdminFAQs";
import SuperAdminNavbar from "./SuperAdminNavbar";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    pending: 0,
    policies: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch user count
  const fetchUsersCount = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1");
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);

      const data = await res.json();
      console.log("User API response:", data);

      return Array.isArray(data) ? data.length : 0;
    } catch (err) {
      console.error("Error fetching users:", err);
      return 0;
    }
  };

  // ✅ Fetch all dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [admins, pending, usersCount] = await Promise.all([
          fetchAllAdmins(),
          fetchPendingAdmins(),
          fetchUsersCount(),
        ]);

        setStats({
          users: usersCount,
          admins: admins.length,
          pending: pending.length,
          policies: 25,
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
      <SuperAdminSidebar />
      <div style={styles.main}>
        <SuperAdminNavbar />

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
                      <div
                        style={styles.card}
                        onClick={() => navigate("/superadmin/dashboard/users")}
                      >
                        <h3>Total Users</h3>
                        <p>{stats.users}</p>
                      </div>
                      <div
                        style={styles.card}
                        onClick={() => navigate("/superadmin/dashboard/admins")}
                      >
                        <h3>Total Admins</h3>
                        <p>{stats.admins}</p>
                      </div>
                      <div
                        style={styles.card}
                        onClick={() =>
                          navigate("/superadmin/dashboard/admins")
                        }
                      >
                        <h3>Pending Approvals</h3>
                        <p>{stats.pending}</p>
                      </div>
                      <div
                        style={styles.card}
                        onClick={() =>
                          navigate("/superadmin/dashboard/policies")
                        }
                      >
                        <h3>Total Policies</h3>
                        <p>{stats.policies}</p>
                      </div>
                    </div>
                  )}
                </div>
              }
            />

            {/* Profile */}
            <Route path="profile" element={<SuperAdminProfile />} />

            {/* Other routes */}
            <Route path="users" element={<h2>Manage Users (Coming Soon)</h2>} />
            <Route path="policies" element={<h2>Manage Policies (Coming Soon)</h2>} />
            <Route path="claims" element={<h2>Manage Claims (Coming Soon)</h2>} />
            <Route path="doctors" element={<SuperAdminDoctors />} />
            <Route path="doctors/:id" element={<DoctorDetails />} />
            <Route path="admins" element={<SuperAdminAdmins />} />
            <Route path="faqs" element={<SuperAdminFAQs />} />
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
    backgroundColor: "#f4f6f8",
  },

  // main area beside sidebar
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  // navbar + page content area
  content: {
    flex: 1,
    padding: "20px",
    background: "#f4f6f8",
    overflowX: "auto",  // enables horizontal scroll for wide tables
    overflowY: "auto",
  },

  // dashboard cards grid
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
};
