import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLogin, setIsLogin] = useState(true); 

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = isLogin
        ? 'http://localhost:8089/api/v1/login'
        : 'http://localhost:8089/api/v1/save';

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(apiUrl, payload);

      setMessage(response.data);
      setMessageType('success');
      setFormData({ userName: '', email: '', password: '' });

      if (isLogin) {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setMessage(isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.');
      setMessageType('error');
      console.error(error);
    }
  };

  const switchMode = (mode) => {
    setIsLogin(mode === 'login');
    setFormData({ userName: '', email: '', password: '' });
    setMessage('');
    setMessageType('');
  };

  return (
    <div className="login-page-wrapper">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>

        {!isLogin && (
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="userName"
              placeholder="Enter your name"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group password-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder={isLogin ? 'Enter password' : 'Create password'}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="toggle-eye" onClick={togglePassword}>
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
        </div>

        <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>

        {message && (
          <p className={`response-message ${messageType === 'error' ? 'error' : 'success'}`}>
            {message}
          </p>
        )}

        <div className="footer-text">
          {isLogin ? (
            <>
              Don’t have an account?{' '}
              <span className="fake-link" onClick={() => switchMode('register')}>
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span className="fake-link" onClick={() => switchMode('login')}>
                Sign in
              </span>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
