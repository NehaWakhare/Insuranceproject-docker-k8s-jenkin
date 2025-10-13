
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


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(formData.userName, formData.email, formData.password);
      setMessage("Registration successful! Please login.");
      setIsLogin(true);
      setFormData({ ...formData, password: '' });
    } catch (err) {
      setMessage(err.response?.data?.error || err.response?.data || "Registration failed");
    }
  };

  // Login (Send OTP)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      alert("OTP sent to your email");
     // setMessage("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  // Verify OTP & Save User
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

  return (
    <div className="auth-page">
      <div className="auth-form">
         <div className="close-button" onClick={() => navigate('/')}>
      &times;
    </div>
        <h2>{isLogin ? (step === 1 ? "Login" : "Verify OTP") : "Register"}</h2>

        {isLogin && step === 1 && (
          <form onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <button type="submit">Send OTP</button>
            <p className="footer-text">
              Don't have an account? <span className="fake-link" onClick={() => setIsLogin(false)}>Register</span>
            </p>
          </form>
        )}

        {isLogin && step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <input type="text" name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} required />
            <button type="submit">Verify OTP</button>
          </form>
        )}

        {!isLogin && (
          <form onSubmit={handleRegister}>
            <input type="text" name="userName" placeholder="Full Name" value={formData.userName} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <button type="submit">Register</button>
            <p className="footer-text">
              Already have an account? <span className="fake-link" onClick={() => setIsLogin(true)}>Login</span>
            </p>
          </form>
        )}

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}
