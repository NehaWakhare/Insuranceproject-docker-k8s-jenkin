import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  
import { registerAdmin } from "../AdminAPI/AdminRegisterAPI.js";  
import "../../pages/Admin/AdminRegister.css";


const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gstNumber: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerAdmin(formData);
      setMessage("Registration request sent! Await Super Admin approval.");
      console.log("Response:", response.data);

     
      setTimeout(() => {
        navigate("/admin/login");
      }, 1500);

    } catch (error) {
      if (error.response) {
        setMessage(
          ` Registration failed: ${
            error.response.data.message || "Server error"
          }`
        );
      } else if (error.request) {
        setMessage("No response from server. Check backend is running.");
      } else {
        setMessage("Request failed: " + error.message);
      }
      console.error("Axios Error:", error);
    }
  };

  return (
    
    <div className="admin-register-container">
      <h2>Admin Registration</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="admin-register-form">
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>GST No:</label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Register
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;
