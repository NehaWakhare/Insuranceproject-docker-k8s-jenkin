import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Stethoscope, 
  CheckCircle, 
  Shield, 
  LogOut 
} from "lucide-react"; 

export default function SuperAdminSidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/superadmin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Users", path: "/superadmin/dashboard/users", icon: <Users size={18} /> },
    { name: "Admins", path: "/superadmin/dashboard/admins", icon: <Shield size={18} /> },
    { name: "Doctors", path: "/superadmin/dashboard/doctors", icon: <Stethoscope size={18} /> },
    { name: "Policies", path: "/superadmin/dashboard/policies", icon: <FileText size={18} /> },
    { name: "Claims", path: "/superadmin/dashboard/claims", icon: <FileText size={18} /> },
    { name: "Approvals", path: "/superadmin/dashboard/approvals", icon: <CheckCircle size={18} /> },
    { name: "Logout", path: "/superadmin/logout", icon: <LogOut size={18} /> },
  ];

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Super Admin</h2>
      <nav style={styles.nav}>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.link,
              backgroundColor: isActive ? "#2563eb" : "transparent",
              color: isActive ? "#fff" : "#333",
            })}
          >
            <span style={styles.icon}>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "240px",
    backgroundColor: "#fff",
    borderRight: "1px solid #ddd",
    padding: "20px 10px",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "30px",
    textAlign: "center",
    color: "#2563eb",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "15px",
    transition: "0.3s",
  },
  icon: {
    marginRight: "10px",
    display: "flex",
    alignItems: "center",
  },
};