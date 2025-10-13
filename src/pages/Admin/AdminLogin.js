import React, { useState } from "react";
import "./AdminLogin.css";
import { login, verifyOtp } from "../AdminAPI/AdminLoginAPI";
import { useNavigate, Link } from "react-router-dom"; 

export default function AdminLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: "", password: "", otp: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Step 1: Login and send OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData.email, formData.password);

      if (res.token && res.role === "SUPER_ADMIN") {
        sessionStorage.setItem("adminId", res.id || "1");
        sessionStorage.setItem("adminRole", res.role);
        sessionStorage.setItem("adminToken", res.token);
        sessionStorage.setItem("adminUsername", res.username || "SuperAdmin");
        
        setTimeout(() => navigate("/admin/dashboard"), 500);
        return;
      }

      window.alert("OTP sent to your email");
      setStep(2);
    } catch (err) {
      console.error(err);
      window.alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOtp(formData.email, formData.otp, formData.password);

      sessionStorage.setItem("adminId", res.id);
      sessionStorage.setItem("adminRole", res.role);
      sessionStorage.setItem("adminToken", res.token);
      sessionStorage.setItem("adminUsername", res.username);
      
      setTimeout(() => navigate("/admin/dashboard/"), 500);
    } catch (err) {
      console.error(err);
      window.alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
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
            <button type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
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
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === 1 && (
          <p className="auth-message2">
            Don't have an account?{" "}
            <Link to="/Admin/AdminRegister" className="Register-link">
              Register
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
