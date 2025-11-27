import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AuthPage from "./pages/User/auth/AuthPage";
import Support from "./pages/Support";
import AvailablePolicies from "./pages/AvailablePolicies";
import HospitalSearch from "./pages/HospitalSearch";
import Teleconsultation from "./pages/Teleconsultation";
// import Claims from "./pages/Claims";
import UserDashboard from "./pages/User/dashboard/UserDashboard";
import { AuthProvider } from "./context/AuthContext";
import HealthPlans from "./components/HealthPlans";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

//  SuperAdmin Pages
import SuperAdminLogin from "./pages/SuperAdmin/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import SuperAdminRoute from "./pages/SuperAdmin/SuperAdminRoute";
import SuperAdminUsers from "./pages/SuperAdmin/Users/SuperAdminUsers";
import SuperAdminAdmins from "./pages/SuperAdmin/Admins/SuperAdminAdmins";
import SuperAdminFAQs from "./pages/SuperAdmin/FAQs/SuperAdminFAQs";
import SuperAdminTeleconsultation from "./pages/SuperAdmin/Teleconsultation/Teleconsultation";

import ContactForm from "./components/ContactForm";

function App() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/auth",
    "/superadmin/login",
    "/superadmin/dashboard",
    "/admin/login",
    "/admin/dashboard",
    "/dashboard"
  ];

  const shouldHideNavbar = hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {!shouldHideNavbar && <div className="navbar-spacer" />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/support" element={<Support />} />
        {/* <Route path="/claims" element={<Claims />} /> */}
        <Route path="/hospital-search" element={<HospitalSearch />} />
        <Route path="/teleconsultation" element={<Teleconsultation />} />
        <Route path="/health-plans" element={<HealthPlans />} />

        <Route
          path="/wellness"
          element={
            <div style={{ padding: "2rem" }}>
              <h2>Wellness Coming Soon</h2>
            </div>
          }
        />

        <Route path="/register-agent" element={<ContactForm />} />

        {/* User Dashboard */}
        <Route path="/dashboard/*" element={<UserDashboard />} />
        <Route path="/available-policies/:id" element={<AvailablePolicies />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />

        {/* Super Admin Routes */}
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route
          path="/superadmin/dashboard/*"
          element={
            <SuperAdminRoute>
              <SuperAdminDashboard />
            </SuperAdminRoute>
          }
        />

        {/* SuperAdmin Admin Management */}
        <Route
          path="/superadmin/dashboard/admins"
          element={
            <SuperAdminRoute>
              <SuperAdminAdmins />
            </SuperAdminRoute>
          }
        />

        {/* SuperAdmin User Management */}
        <Route
          path="/superadmin/dashboard/users"
          element={
            <SuperAdminRoute>
              <SuperAdminUsers />
            </SuperAdminRoute>
          }
        />

        {/* SuperAdmin FAQs */}
        <Route
          path="/superadmin/dashboard/faqs"
          element={
            <SuperAdminRoute>
              <SuperAdminFAQs />
            </SuperAdminRoute>
          }
        />

        {/* ✅ SuperAdmin Teleconsultation (NEW) */}
        <Route
          path="/superadmin/dashboard/teleconsultation/*"
          element={
            <SuperAdminRoute>
              <SuperAdminTeleconsultation />
            </SuperAdminRoute>
          }
        />

      </Routes>
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
