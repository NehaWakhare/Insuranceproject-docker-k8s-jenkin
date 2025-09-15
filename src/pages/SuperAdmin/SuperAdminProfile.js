import React, { useState, useEffect } from "react";

export default function SuperAdminProfile() {
  const [profile, setProfile] = useState({
    name: "Super Admin",
    role: "Super Admin",
    email: "superadmin@qsthealth.com",
    phone: "+91 9876543210",
    avatar: ""
  });

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(profile);

  // Load saved profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("superadminProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedProfile = { ...profile, avatar: reader.result };
        setProfile(updatedProfile);
        localStorage.setItem("superadminProfile", JSON.stringify(updatedProfile));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setProfile(formData);
    localStorage.setItem("superadminProfile", JSON.stringify(formData));
    setShowModal(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.banner}></div>
      <div style={styles.card}>
        {/* Profile Avatar */}
        <div style={styles.avatarWrapper}>
          <img
            src={
              profile.avatar ||
              "https://www.w3schools.com/howto/img_avatar.png"
            }
            alt="Profile"
            style={styles.avatar}
          />
          <label htmlFor="upload-avatar" style={styles.uploadBtn}>
            Change
          </label>
          <input
            type="file"
            id="upload-avatar"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>

        {/* Name & Role */}
        <h2 style={styles.name}>{profile.name}</h2>
        <p style={styles.role}>{profile.role}</p>

        {/* Info Section */}
        <div style={styles.info}>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
        </div>

        {/* Edit Button */}
        <button style={styles.editBtn} onClick={() => { setFormData(profile); setShowModal(true); }}>
          Edit Profile
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ marginBottom: "15px" }}>Edit Profile</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleInputChange}
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={styles.input}
            />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "20px",
  },
  banner: {
    width: "100%",
    height: "120px",
    backgroundColor: "#2563eb",
    borderRadius: "8px 8px 0 0",
  },
  card: {
    marginTop: "-60px",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "400px",
    position: "relative",
  },
  avatarWrapper: {
    position: "relative",
    display: "inline-block",
    marginBottom: "15px",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
  uploadBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "12px",
    cursor: "pointer",
  },
  name: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "10px 0 5px",
  },
  role: {
    color: "#2563eb",
    marginBottom: "15px",
  },
  info: {
    textAlign: "left",
    marginBottom: "20px",
    fontSize: "14px",
    color: "#333",
    lineHeight: "1.6",
  },
  editBtn: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "0.3s",
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  cancelBtn: {
    backgroundColor: "#ddd",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};