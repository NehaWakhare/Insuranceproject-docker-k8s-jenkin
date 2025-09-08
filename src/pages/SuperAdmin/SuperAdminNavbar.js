import React from "react";
import { LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    navigate("/superadmin/login");
  };

  return (
    <div style={styles.navbar}>
     
      <div style={styles.left}>
        <h2 style={styles.logo}>Super Admin Dashboard</h2>
      </div>

     
      <div style={styles.right}>
        <UserCircle size={28} style={styles.icon} />
        <button style={styles.logoutBtn} onClick={handleLogout}>
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
    backgroundColor: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  icon: {
    cursor: "pointer",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
};
