import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/HomePage/Home/Home";
import AuthPage from "./pages/User/auth/AuthPage";
import Support from "./components/Navbar/Support";
import AvailablePolicies from "./pages/HomePage/PolicyTiles/AvailablePolicies";
import HospitalSearch from "./pages/HomePage/Services/HospitalSearch";
import Teleconsultation from "./pages/HomePage/Services/Teleconsultation";
// import Claims from "./pages/Claims";
import UserDashboard from "./pages/User/dashboard/UserDashboard";
import { AuthProvider } from "./context/AuthContext";
import HealthPlans from "./pages/HomePage/PolicyTiles/HealthPlans";
import TC from "./components/Footer/footer/TC";
import CompanyOverview from "./components/Footer/footer/CompanyOverview";
import LeadershipTeam from "./components/Footer/footer/LeadershipTeam";
import PressMedia from "./components/Footer/footer/PressMedia";
import PrivacyPolicy from "./components/Footer/footer/PrivacyPolicy";
import Disclaimer from "./components/Footer/footer/Disclaimer";
import ChatWithUs from "./components/Footer/footer/ChatWithUs";
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

import ContactForm from "./components/Navbar/ContactForm";

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
        <Route path="/terms" element={<TC />} />

        <Route path="/register-agent" element={<ContactForm />} />
        <Route path="/about" element={<CompanyOverview />} />
<Route path="/team" element={<LeadershipTeam />} />
<Route path="/media" element={<PressMedia />} />
<Route path="/privacy" element={<PrivacyPolicy />} />
<Route path="/disclaimer" element={<Disclaimer />} />

<Route path="/chat" element={<ChatWithUs />} />

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
