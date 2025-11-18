import { Routes, Route, useNavigate } from "react-router-dom";
import React, { useState, useContext, useEffect, useRef } from "react";
import UserSidebar from "./UserSidebar";
import ProfileInfo from "./ProfileInfo";
import MyAppointments from "./MyAppointments";
import MyPolicies from "./MyPolicies";
import MyDocuments from "./MyDocuments";
import { AuthContext } from "../../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import CONFIG from "../../../config/config";
import "./UserDashboard.css";

export default function UserDashboard() {
  const { logoutUser } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const BASE_URL = CONFIG.BASE_URL; // ✅ base URL

  const handleLogout = () => {
    logoutUser();
    navigate("/auth");
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  // Fetch logged-in user details
  useEffect(() => {
    const authData = sessionStorage.getItem("authData");
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        const { userId } = parsedData;

        if (userId) {
          axios
            .get(`${BASE_URL}/api/v1/${userId}`) // ✅ use BASE_URL
            .then((res) => setUserDetails(res.data))
            .catch((err) => console.error("Failed to fetch user details:", err));
        }
      } catch (error) {
        console.error("Invalid authData in sessionStorage:", error);
      }
    }
  }, []);

  return (
    <div className="user-dashboard-container">
      <div className="user-dashboard-sidebar">
        <UserSidebar />
      </div>
      <div className="user-dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-heading">User Dashboard</h1>

          {/* Profile Icon Dropdown */}
          <div className="profile-icon-container" ref={profileRef}>
            <FaUserCircle className="user-icon" onClick={toggleProfile} />
            {showProfile && (
              <div className="profile-dropdown">
                <p className="user-email">{userDetails?.email || "user@mail.com"}</p>
                <hr />
                <span className="dropdown-logout" onClick={handleLogout}>
                  Logout
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="user-dashboard-content">
          <Routes>
            <Route path="profile" element={<ProfileInfo />} />
            <Route path="appointments" element={<MyAppointments />} />
            <Route path="policies" element={<MyPolicies />} />
            <Route path="documents" element={<MyDocuments />} />
            {/* <Route path="claims" element={<MyClaims />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}
