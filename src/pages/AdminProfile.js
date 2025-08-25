import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminProfile.css';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const adminId = sessionStorage.getItem('userId'); 
console.log("Admin ID from sessionStorage:", adminId);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/admins/${adminId}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching admin profile:', error);
      }
    };

    fetchProfile();
  }, [adminId]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="admin-profile-container">
      <h2>Admin Profile</h2>
      <div className="profile-field"><strong>Name:</strong> {profile.name}</div>
      <div className="profile-field"><strong>Email:</strong> {profile.email}</div>
      <div className="profile-field"><strong>Phone:</strong> {profile.phoneNumber}</div>
      <div className="profile-field"><strong>Date of Birth:</strong> {profile.dateOfBirth}</div>
      <div className="profile-field"><strong>Govt ID:</strong> {profile.governmentId}</div>
      <div className="profile-field"><strong>Company:</strong> {profile.companyName}</div>
      <div className="profile-field"><strong>Company Type:</strong> {profile.companyType}</div>
      <div className="profile-field"><strong>GST/PAN:</strong> {profile.gstOrPanNumber}</div>
      <div className="profile-field"><strong>Head Office:</strong> {profile.headOfficeAddress}</div>
      <div className="profile-field"><strong>City:</strong> {profile.city}</div>
      <div className="profile-field"><strong>State:</strong> {profile.state}</div>
      <div className="profile-field"><strong>Country:</strong> {profile.country}</div>
      <div className="profile-field"><strong>Pin Code:</strong> {profile.pinCode}</div>
    </div>
  );
};

export default AdminProfile;
