// src/pages/SuperAdmin/Users/SuperAdminUsers.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8089/api";

export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ userName: "", email: "", password: "" });

  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/v1`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //  Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open modal
  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ userName: user.userName, email: user.email, password: "" });
    } else {
      setEditingUser(null);
      setFormData({ userName: "", email: "", password: "" });
    }
    setShowModal(true);
  };

  // Save user (Add or Edit)
  const saveUser = async () => {
    try {
      if (editingUser) {
        await axios.put(`${API_BASE}/v1/update/${editingUser.userId}`, formData);
      } else {
        await axios.post(`${API_BASE}/v1/save`, formData);
      }
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  //  Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_BASE}/v1/delete/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  //  View user profile
  const viewProfile = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/user-profiles/by-user/${id}`);
      setProfileData(res.data);
      setShowProfile(true);
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Profile not found for this user.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>👥 Manage Users</h2>
      {/* <button
        onClick={() => openModal()}
        style={{
          background: "#4cafef",
          color: "#fff",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          marginBottom: "1rem",
          cursor: "pointer",
        }}
      >
        ➕ Add User
      </button> */}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead style={{ background: "#4cafef", color: "#fbfafaff" }}>
            <tr>
              <th style={{ padding: "10px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Role</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.userId} style={{ borderBottom: "1px solid #faf7f7ff" }}>
                  <td style={{ padding: "10px" }}>{u.userId}</td>
                  <td style={{ padding: "10px" }}>{u.userName}</td>
                  <td style={{ padding: "10px" }}>{u.email}</td>
                  <td style={{ padding: "10px" }}>{u.role}</td>
                  <td
                    style={{
                      padding: "10px",
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => viewProfile(u.userId)}
                      style={{
                        background: "#2196f3",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      👁 View
                    </button>
                    <button
                      onClick={() => openModal(u)}
                      style={{
                        background: "#ffa500",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteUser(u.userId)}
                      style={{
                        background: "#f44336",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h3>{editingUser ? "Edit User" : "Add User"}</h3>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Name"
              style={{ width: "100%", margin: "8px 0", padding: "10px" }}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              style={{ width: "100%", margin: "8px 0", padding: "10px" }}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              style={{ width: "100%", margin: "8px 0", padding: "10px" }}
            />

            <div style={{ marginTop: "1rem", display: "flex", gap: "10px" }}>
              <button
                onClick={saveUser}
                style={{
                  background: "#4cafef",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                💾 Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "#ccc",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && profileData && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              width: "450px",
            }}
          >
            <h3>👤 User Profile</h3>
            <p><strong>Name:</strong> {profileData.fullName}</p>
            <p><strong>Phone:</strong> {profileData.phoneNumber}</p>
            <p><strong>Address:</strong> {profileData.address}</p>
            <p><strong>DOB:</strong> {profileData.dateOfBirth}</p>

            <div style={{ marginTop: "1rem", textAlign: "right" }}>
              <button
                onClick={() => setShowProfile(false)}
                style={{
                  background: "#4cafef",
                  color: "#ffffffff",
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
      )}
    </div>
  );
}
