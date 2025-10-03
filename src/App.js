import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import AuthPage from "./pages/User/auth/AuthPage";
import Support from "./pages/Support";
import AvailablePolicies from "./pages/AvailablePolicies";
import HospitalSearch from "./pages/HospitalSearch";
import Teleconsultation from "./pages/Teleconsultation";
import Claims from "./pages/Claims";
import UserDashboard from "./pages/User/dashboard/UserDashboard";
import { AuthProvider } from "./context/AuthContext";

// 🔹 Admin Pages
import AdminRegister from "./pages/Admin/AdminRegister";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard"; 

// 🔹 SuperAdmin Pages
import SuperAdminLogin from "./pages/SuperAdmin/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import SuperAdminRoute from "./pages/SuperAdmin/SuperAdminRoute";

// ✅ New SuperAdmin User Management Page
import SuperAdminUsers from "./pages/SuperAdmin/Users/SuperAdminUsers";

// ✅ New SuperAdmin Admin Management (Tabs for List + Approvals)
import SuperAdminAdmins from "./pages/SuperAdmin/Admins/SuperAdminAdmins";

function App() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/auth",
    "/superadmin/login",
    "/superadmin/dashboard",
  ];

  const hideFooterRoutes = [
    "/admin/dashboard",
    "/admin/register",
    "/admin/login",
    "/superadmin/login",
    "/superadmin/dashboard",
  ];

  const shouldHideNavbar = hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );
  const shouldHideFooter = hideFooterRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {!shouldHideNavbar && <div className="navbar-spacer" />}

      <Routes>
        {/* 🔹 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/hospital-search" element={<HospitalSearch />} />
        <Route path="/teleconsultation" element={<Teleconsultation />} />
        <Route
          path="/wellness"
          element={
            <div style={{ padding: "2rem" }}>
              <h2>Wellness Coming Soon</h2>
            </div>
          }
        />

        {/* 🔹 User Dashboard */}
        <Route path="/dashboard/*" element={<UserDashboard />} />
        <Route path="/available-policies/:id" element={<AvailablePolicies />} />

        {/* 🔹 Admin Routes */}
        <Route path="/Admin/AdminRegister" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />

        {/* 🔹 Super Admin Routes */}
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route
          path="/superadmin/dashboard/*"
          element={
            <SuperAdminRoute>
              <SuperAdminDashboard />
            </SuperAdminRoute>
          }
        />

        {/* ✅ New SuperAdmin Admin Management (List + Approvals in Tabs) */}
        <Route
          path="/superadmin/dashboard/admins"
          element={
            <SuperAdminRoute>
              <SuperAdminAdmins />
            </SuperAdminRoute>
          }
        />

        {/* ✅ New SuperAdmin User Management */}
        <Route
          path="/superadmin/dashboard/users"
          element={
            <SuperAdminRoute>
              <SuperAdminUsers />
            </SuperAdminRoute>
          }
        />
      </Routes>

      {!shouldHideFooter && <Footer />}
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}
