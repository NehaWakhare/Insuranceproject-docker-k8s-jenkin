import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerAdmin } from "../AdminAPI/AdminRegisterAPI.js";
import "../Admin/AdminRegister.css";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gstNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerAdmin(formData);
      window.alert("Registration request sent! Await Super Admin approval.");
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (error) {
      let msg = "Request failed!";
      if (error.response)
        msg = `Registration failed: ${error.response.data.message || "Server error"}`;
      else if (error.request)
        msg = "No response from server. Check backend is running.";
      else msg = "Request failed: " + error.message;
      window.alert(msg);
      console.error("Axios Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-page">
      <div className="admin-register-container small">
        <h2>Admin Registration</h2>
        <form onSubmit={handleSubmit} className="admin-register-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="GST Number"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-redirect">
          Already have an account?{" "}
          <Link to="/admin/login" className="login-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
