import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8089/api/user-profiles";

export default function ViewProfile({ userId, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/by-user/${userId}`);
        if (res.data && Object.keys(res.data).length > 0) {
          setProfile(res.data);
          setError("");
        } else {
          setError("No profile found for this user.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Unable to fetch user profile. Please check backend.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  if (!userId) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "10px",
          width: "450px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
        }}
      >
        <h3>👤 User Profile</h3>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          profile && (
            <div style={{ marginTop: "1rem" }}>
              <ProfileItem label="Name" value={profile.name} />
              <ProfileItem label="Email" value={profile.email} />
              <ProfileItem label="Phone" value={profile.phone} />
              <ProfileItem label="DOB" value={profile.dob} />
              <ProfileItem label="Gender" value={profile.gender} />
              <ProfileItem label="Occupation" value={profile.occupation} />
              <ProfileItem label="Blood Group" value={profile.bloodGroup} />
              <ProfileItem label="Marital Status" value={profile.maritalStatus} />
              <ProfileItem
                label="Permanent Address"
                value={profile.permanentAddress}
              />
              <ProfileItem
                label="Correspondence Address"
                value={profile.correspondenceAddress}
              />
              <ProfileItem
                label="Emergency Contact"
                value={profile.emergencyContact}
              />
              <ProfileItem
                label="Aadhaar Number"
                value={profile.aadhaarNumber}
              />
            </div>
          )
        )}

        <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{
              background: "#4cafef",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const ProfileItem = ({ label, value }) => (
  <p>
    <strong>{label}:</strong> {value || "—"}
  </p>
);
