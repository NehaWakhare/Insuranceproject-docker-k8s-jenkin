import React, { useState } from "react";
import "./AdminLogin.css";
import { login, verifyOtp } from "../AdminAPI/AdminLoginAPI";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: "", password: "", otp: "" });
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Step 1: Login and send OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData.email, formData.password);

      // If SUPER_ADMIN, directly store token and navigate
      if (res.token && res.role === "SUPER_ADMIN") {
        sessionStorage.setItem("adminId", res.id || "1");
        sessionStorage.setItem("adminRole", res.role);
        sessionStorage.setItem("adminToken", res.token);
        sessionStorage.setItem("adminUsername", res.username || "SuperAdmin");
        navigate("/Admin/Dashboard");
        return;
      }

      setMessage("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data || "Login failed");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtp(formData.email, formData.otp, formData.password);

      // Save admin info in sessionStorage
      sessionStorage.setItem("adminId", res.id);
      sessionStorage.setItem("adminRole", res.role);
      sessionStorage.setItem("adminToken", res.token);
      sessionStorage.setItem("adminUsername", res.username);

      setMessage("Login successful!");
      navigate("/Admin/Dashboard");
    } catch (err) {
      setMessage(err.response?.data || "Invalid OTP");
    }
  };

  return (
    <div className="auth-page2">
      <div className="auth-form2">
        <h2>{step === 1 ? "Admin Login" : "Verify OTP"}</h2>

        {step === 1 && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Send OTP</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              required
            />
            <button type="submit">Verify OTP</button>
          </form>
        )}

        {message && <p className="auth-message2">{message}</p>}
      </div>
    </div>
  );
}
