import React, { useEffect, useState } from "react";
import axios from "axios";
import SuperAdminSidebar from "../SuperAdminSidebar";
import SuperAdminNavbar from "../SuperAdminNavbar";
import CONFIG from "../../../config/config"; // ✅ import config

const API_BASE_USERS = CONFIG.BASE_URL + "/api/v1"; // ✅ use base URL

export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ userName: "", email: "", password: "" });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE_USERS);
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

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Add/Edit modal
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

  // Save user (Add/Edit)
  const saveUser = async () => {
    try {
      if (editingUser) {
        await axios.put(`${API_BASE_USERS}/update/${editingUser.userId}`, formData);
      } else {
        await axios.post(`${API_BASE_USERS}/save`, formData);
      }
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_BASE_USERS}/delete/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SuperAdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <SuperAdminNavbar />

        <div style={{ flex: 1, padding: "20px", background: "#f4f6f8" }}>
          <h2 style={{ marginBottom: "1rem" }}>👥 Manage Users</h2>

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
              <thead style={{ background: "#4cafef", color: "#fff" }}>
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
                    <tr key={u.userId} style={{ borderBottom: "1px solid #faf7f7" }}>
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
                top: 0,
                left: 0,
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
        </div>
      </div>
    </div>
  );
}
