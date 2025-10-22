import { Routes, Route,useNavigate } from 'react-router-dom';
import React, { useState, useContext, useEffect, useRef } from 'react';
import UserSidebar from './UserSidebar';
import ProfileInfo from './ProfileInfo';
import MyAppointments from './MyAppointments';
import MyPolicies from './MyPolicies';
import MyDocuments from './MyDocuments';
import { AuthContext } from '../../../context/AuthContext';
import MyClaims from './MyClaims'; 
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import './UserDashboard.css';



export default function UserDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
 const [showProfile, setShowProfile] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

    function handleLogout() {
    logoutUser();
    navigate('/auth');
  }

  
  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  // Fetch logged-in user details
  useEffect(() => {
    const authData = localStorage.getItem('authData');
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        const { userId } = parsedData;

        if (userId) {
          axios
            .get(`http://localhost:8089/api/v1/${userId}`)
            .then((res) => {
              setUserDetails(res.data);
            })
            .catch((err) => {
              console.error('Failed to fetch user details:', err);
            });
        }
      } catch (error) {
        console.error('Invalid authData in localStorage:', error);
      }
    }
  }, []);

  return (
    <div className="user-dashboard-container">
      <UserSidebar />
      <div className="user-dashboard-main">
        <h1 className="dashboard-heading">User Dashboard</h1>
         {/* Profile Icon Dropdown */}
                    <div className="profile-icon" ref={profileRef}>
                      <FaUserCircle className="user-icon" onClick={toggleProfile} />
            
                      {showProfile && (
                        <div className="profile-dropdown">
                          {/* <p className="user-name">{userDetails?.name || ''}</p> */}
                          <p className="user-email">{userDetails?.email || 'user@mail.com'}</p>
                          <hr />
                          <span className="dropdown-logout" onClick={handleLogout}>
                    Logout
                  </span>
                    
                        </div>
                      )}
                    </div>
                  
        <div className="user-dashboard-content">
          <Routes>
            <Route path="profile" element={<ProfileInfo />} />
            <Route path="appointments" element={<MyAppointments />} />
            <Route path="policies" element={<MyPolicies />} />
            <Route path="documents" element={<MyDocuments />} />
            <Route path="claims" element={<MyClaims />} /> 
          </Routes>
        </div>
      </div>
    </div>
  );
}
