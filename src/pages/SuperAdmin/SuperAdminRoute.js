import React from "react";
import { Navigate } from "react-router-dom";

export default function SuperAdminRoute({ children }) {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  // If no token or wrong role, kick back to login
  if (!token || role !== "SUPER_ADMIN") {
    return <Navigate to="/superadmin/login" replace />;
  }

  return children;
}
