import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import CONFIG from '../config/config';

const BASE_URL = CONFIG.BASE_URL;

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showExplore, setShowExplore] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  const toggleExplore = () => {
    setShowExplore((prev) => !prev);
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  // Fetch logged-in user details
  useEffect(() => {
    const authData = sessionStorage.getItem('authData');
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        const { userId } = parsedData;

        if (userId) {
          axios
            .get(`${BASE_URL}/api/v1/${userId}`)
            .then((res) => {
              setUserDetails(res.data);
            })
            .catch((err) => {
              console.error('Failed to fetch user details:', err);
            });
        }
      } catch (error) {
        console.error('Invalid authData in sessionStorage:', error);
      }
    }
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <nav className="navbar">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>

        {user?.role === 'USER' && (
          <>
            {/* Explore Dropdown */}
            <div className="dropdown">
              <span className="nav-link" onClick={toggleExplore}>Explore ▼</span>
              {showExplore && (
                <div className="dropdown-menu">
                  <a href="/hospital-search" className="dropdown-item">Hospitals</a>
                  <a href="/teleconsultation" className="dropdown-item">Teleconsultation</a>
                  <a href="/wellness" className="dropdown-item">Health & Wellness</a>
                  <a href="/health-plans" className="dropdown-item">Policies</a>
                </div>
              )}
            </div>

            {/* <Link to="/claims" className="nav-link">Claims</Link> */}

            {/* Profile Icon Dropdown */}
            <div className="profile-icon" ref={profileRef}>
              <FaUserCircle className="user-icon" onClick={toggleProfile} />
    
              {showProfile && (
                <div className="profile-dropdown">
                  {/* <p className="user-name">{userDetails?.name || ''}</p> */}
                  <p className="user-email">{userDetails?.email || 'user@mail.com'}</p>
                  <hr />
                  <Link
                    to="/dashboard/profile"
                    className="dropdown-dashboard"
                    onClick={() => setShowProfile(false)}
                  >
                    Dashboard
                  </Link>
                  <span className="dropdown-logout" onClick={handleLogout}>
                    Logout
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        

        {!user && <Link to="/auth" className="nav-link">Login</Link>}
        <Link to="/support" className="nav-link contact">24*7 Contact</Link>
      </div>
    </nav>
  );
}
