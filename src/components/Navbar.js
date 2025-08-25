import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [showExploreDropdown, setShowExploreDropdown] = useState(false);
  const [userRole, setUserRole] = useState(sessionStorage.getItem('userRole'));

  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(sessionStorage.getItem('userRole'));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setUserRole(null); 
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>

        {userRole === 'USER' && (
          <>
            <Link to="/dashboard/profile" className="nav-link">Dashboard</Link>

            {/* Explore Dropdown */}
            <div
              className="dropdown"
              onMouseEnter={() => setShowExploreDropdown(true)}
              onMouseLeave={() => setShowExploreDropdown(false)}
            >
              <span className="nav-link">Explore</span>
              {showExploreDropdown && (
                <div className="dropdown-menu">
                  <a href="/#hospitals" className="dropdown-item">Hospitals</a>
                  <a href="/#teleconsult" className="dropdown-item">Teleconsultation</a>
                  <a href="/#wellness" className="dropdown-item">Health & Wellness</a>
                  <a href="/#policies" className="dropdown-item">Policies</a>
                </div>
              )}
            </div>

            <Link to="/claims" className="nav-link">Claims</Link>
            <span className="nav-link logout" onClick={handleLogout}>Logout</span>
          </>
        )}

        {userRole === 'ADMIN' && (
          <>
            <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
            <span className="nav-link logout" onClick={handleLogout}>Logout</span>
          </>
        )}

        {!userRole && <Link to="/auth" className="nav-link">Login</Link>}
        <Link to="/support" className="nav-link contact">24*7 Contact</Link>
      </div>
    </nav>
  );
}
