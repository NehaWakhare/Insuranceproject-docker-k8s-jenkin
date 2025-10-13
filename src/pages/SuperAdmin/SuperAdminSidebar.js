import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Stethoscope, 
  LogOut,
  UserCircle,
  ShieldCheck
} from "lucide-react";

export default function SuperAdminSidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/superadmin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Profile", path: "/superadmin/dashboard/profile", icon: <UserCircle size={18} /> },
    { name: "Users", path: "/superadmin/dashboard/users", icon: <Users size={18} /> },
    { name: "Doctors", path: "/superadmin/dashboard/doctors", icon: <Stethoscope size={18} /> },
    { name: "Policies", path: "/superadmin/dashboard/policies", icon: <FileText size={18} /> },
    { name: "Claims", path: "/superadmin/dashboard/claims", icon: <FileText size={18} /> },
    { name: "Admins", path: "/superadmin/dashboard/admins", icon: <ShieldCheck size={18} /> },
     { name: "FAQs", path: "/superadmin/dashboard/faqs", icon: <FileText size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/superadmin/login");
  };

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

        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <span style={styles.icon}><LogOut size={18} /></span>
          Logout
        </button>
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
    color: "#333",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "15px",
    cursor: "pointer",
    backgroundColor: "transparent",
    border: "none",
    color: "#333",
    transition: "0.3s",
    textAlign: "left",
  },
  icon: {
    marginRight: "10px",
    display: "flex",
    alignItems: "center",
  },
};
