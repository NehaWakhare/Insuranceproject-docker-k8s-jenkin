import React from "react";
import { Navigate } from "react-router-dom";

export default function SuperAdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If no token or wrong role, kick back to login
  if (!token || role !== "SUPER_ADMIN") {
    return <Navigate to="/superadmin/login" replace />;
  }

  return children;
}
