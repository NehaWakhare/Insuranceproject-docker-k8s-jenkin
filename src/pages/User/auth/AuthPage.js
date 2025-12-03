import React, { useContext, useState } from 'react';
import './Auth.css';
import { register, login, verifyOtp } from '../../../services/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    otp: ''
  });
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [resendMessage, setResendMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ------------------------------
  // Password Validation Function
  // ------------------------------
  const validatePassword = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongRegex.test(password)) {
      return "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number & 1 special char.";
    }
    return "";
  };

  // ------------------------------
  // Registration
  // ------------------------------
  const handleRegister = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setValidationErrors({ password: passwordError });
      return;
    } else {
      setValidationErrors({});
    }

    try {
      await register(formData.userName, formData.email, formData.password);
      setMessage("Registration successful! Please login.");
      setIsLogin(true);
      setFormData({ ...formData, password: '' });
    } catch (err) {
      setMessage(err.response?.data?.error || err.response?.data || "Registration failed");
    }
  };

  // ------------------------------
  // Login (Send OTP)
  // ------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      alert("OTP sent to your email");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  // ------------------------------
  // Verify OTP
  // ------------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtp(formData.email, formData.otp);
      console.log("Verify OTP Response:", res);

      const userData = {
        userId: res?.userId,
        userName: res?.userName,
        role: res?.role,
        token: res?.token
      };

      loginUser(userData);
      setMessage("Login successful!");
      navigate("/"); 
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
      alert("Invalid OTP");
    }
  };

  // ------------------------------
  // Resend OTP
  // ------------------------------
  const handleResendOtp = async () => {
    try {
      await login(formData.email, formData.password);
      setResendMessage("OTP resent successfully!");
    } catch (err) {
      setResendMessage("Failed to resend OTP!");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <div className="close-button" onClick={() => navigate('/')}>
          &times;
        </div>

        <h2>{isLogin ? (step === 1 ? "Login" : "Verify OTP") : "Register"}</h2>

        {/* Login Step 1 */}
        {isLogin && step === 1 && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
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
              Don't have an account? <span className="fake-link" onClick={() => setIsLogin(false)}>Register</span>
            </p>
          </form>
        )}

        {/* Login Step 2 - OTP Verification */}
        {isLogin && step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              required
            />
            <button type="submit">Verify OTP</button>

            <p className="resend-otp-text">
              Didn’t get the OTP? 
              <span className="fake-link" onClick={handleResendOtp}> Resend OTP</span>
            </p>

            {resendMessage && <p className="auth-message">{resendMessage}</p>}
          </form>
        )}

        {/* Registration Form */}
        {!isLogin && (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="userName"
              placeholder="Full Name"
              value={formData.userName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
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
            {validationErrors.password && (
              <p className="error-text">{validationErrors.password}</p>
            )}
            <button type="submit">Register</button>
            <p className="footer-text">
              Already have an account? <span className="fake-link" onClick={() => setIsLogin(true)}>Login</span>
            </p>
          </form>
        )}

        {/* General message */}
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}
