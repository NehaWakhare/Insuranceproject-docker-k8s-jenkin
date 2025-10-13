import React from "react";
import { LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("authData");
    navigate("/admin/login");
  };

  return (
    <div style={styles.navbar}>
      <h1 style={styles.logo}>Admin Dashboard</h1>
      <div style={styles.right}>
        <UserCircle size={28} style={styles.icon} />
        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
        >
          <LogOut size={18} style={{ marginRight: "6px" }} />
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    width: "100%",
    height: "60px",
    background: "linear-gradient(90deg, #1565c0, #1565c0)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 25px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  right: { display: "flex", alignItems: "center", gap: "15px" },
  icon: { cursor: "pointer", color: "#fff" },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(229, 30, 30, 1)",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
};
