import React, { useContext, useState } from "react";
import "./AdminLogin.css";
import { login, verifyOtp } from "../../pages/AdminAPI/AdminLoginAPI";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      setMessage("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtp(formData.email, formData.otp, formData.password);


      const adminData = {
        adminId: res?.adminId,
        userName: res?.userName,
        role: res?.role,
        token: res?.token,
      };

      loginUser(adminData);
      setMessage("Login successful!");
      navigate("/Admin/Dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>{step === 1 ? "AdminLogin" : "Verify OTP"}</h2>

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
            <p className="footer-text">
              Don’t have an account?{" "}
              <span
                className="fake-link"
                onClick={() => navigate("/Admin/AdminRegister")}
              >
                Register
              </span>
            </p>
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

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}
