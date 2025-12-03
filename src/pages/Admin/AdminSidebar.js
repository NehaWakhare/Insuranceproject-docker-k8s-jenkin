import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, UserCircle } from "lucide-react";
import logo from "../../assets/logo.png";

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
      {/* ✅ Logo */}
      <div style={styles.logoContainer}>
        <img src={logo} alt="Admin Logo" style={styles.logo} />
      </div>

      {/* ✅ Navigation Menu */}
      <nav style={styles.nav}>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.link,
              backgroundColor: isActive ? "#0d47a1" : "transparent",
              color: isActive ? "#ffffff" : "#0d47a1",
              fontWeight: isActive ? "600" : "500",
              transform: isActive ? "scale(1.03)" : "scale(1)",
            })}
          >
            <span style={styles.iconWrapper}>{item.icon}</span>
            <span style={styles.linkText}>{item.name}</span>
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
    backgroundColor: "#e3f2fd", // Light blue background
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease-in-out",
    zIndex: 100,
  },

  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "25px",
  },

  logo: {
    width: "120px",
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
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "16px",
    transition: "all 0.3s ease",
  },

  linkText: {
    fontFamily: "Poppins, sans-serif",
  },

  iconWrapper: {
    marginRight: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "24px",
    minHeight: "24px",
  },

  /* ✅ Responsive Design */
  "@media (maxWidth: 768px)": {
    sidebar: {
      width: "200px",
      padding: "15px 8px",
    },
    link: {
      fontSize: "14px",
      padding: "10px 14px",
    },
    logo: {
      width: "100px",
    },
  },
};
