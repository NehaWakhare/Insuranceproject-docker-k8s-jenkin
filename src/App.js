import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AddPolicy from './pages/AddPolicy';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/UserLogin/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import Support from './pages/Support';
import AvailablePolicies from './pages/AvailablePolicies';
import HospitalSearch from './pages/HospitalSearch';
import Teleconsultation from './pages/Teleconsultation';
import ViewPolicies from './pages/ViewPolicies';
import AdminUsers from './pages/AdminUsers';
import UserDashboard from './pages/UserDashboard';
import Footer from './components/Footer'; 
import Claims from './pages/Claims';
import { AuthProvider } from './context/AuthContext';

import SuperAdminLogin from './pages/SuperAdmin/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdmin/SuperAdminDashboard';

function App() {
  const location = useLocation();
  
  const hideNavbarRoutes = ['/auth', '/superadmin/login', '/superadmin/dashboard']; 
  const hideFooterRoutes = [
    '/admin/dashboard',
    '/admin/users',
    '/admin/add-policy',
    '/admin/view-policies',
    '/superadmin/login',
    '/superadmin/dashboard'
  ];

  const shouldHideNavbar = hideNavbarRoutes.some(route => location.pathname.startsWith(route));
  const shouldHideFooter = hideFooterRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {!shouldHideNavbar && <div className="navbar-spacer" />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} /> 
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard/*" element={<UserDashboard />} />
        <Route path="/available-policies/:id" element={<AvailablePolicies />} />
        <Route path="/hospital-search" element={<HospitalSearch />} />
        <Route path="/teleconsultation" element={<Teleconsultation />} />
        <Route path="/admin/add-policy" element={<AddPolicy />} />
        <Route path="/wellness" element={<div style={{ padding: '2rem' }}><h2>Wellness Coming Soon</h2></div>} />
        <Route path="/admin/view-policies" element={<ViewPolicies />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/support" element={<Support />} />
        <Route path="/claims" element={<Claims />} />
        
        {/* SuperAdmin routes */}
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/superadmin/dashboard/*" element={<SuperAdminDashboard />} />
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
