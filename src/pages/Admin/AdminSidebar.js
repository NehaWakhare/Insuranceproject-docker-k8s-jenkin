import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, UserCircle } from "lucide-react";
import logo from "../../assets/logo.png"; // ✅ Import your logo

export default function AdminSidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Profile", path: "/admin/dashboard/profile", icon: <UserCircle size={20} /> },
    { name: "Add Policy", path: "/admin/dashboard/add-policy", icon: <FileText size={20} /> },
    { name: "View Policies", path: "/admin/dashboard/view-policies", icon: <FileText size={20} /> },
    { name: "Users", path: "/admin/dashboard/users", icon: <Users size={20} /> },
  ];

  return (
    <div style={styles.sidebar}>
      {/* ✅ Logo instead of heading */}
      <div style={styles.logoContainer}>
        <img src={logo} alt="Admin Logo" style={styles.logo} />
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.link,
              background: isActive
                ? "linear-gradient(135deg, rgba(63, 117, 243, 1), rgba(64, 41, 235, 1))"
                : "#fff",
              color: isActive ? "#fff" : "#000000ff",
              boxShadow: isActive
                ? "0 4px 12px rgba(0,0,0,0.15)"
                : "0 2px 6px rgba(0,0,0,0.05)",
            })}
          >
            <span style={styles.iconWrapper}>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    padding: "20px 10px",
    background: "linear-gradient(180deg, #f0f4f8, #d9e2ec)",
    boxShadow: "2px 0 15px rgba(0,0,0,0.08)",
    zIndex: 100,
  },

  // ✅ New logo container
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "30px",
  },

  // ✅ Logo style
  logo: {
    width: "140px",
    height: "auto",
    borderRadius: "10px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    padding: "12px 18px",
    borderRadius: "12px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  iconWrapper: {
    marginRight: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "28px",
    minHeight: "28px",
  },
};
