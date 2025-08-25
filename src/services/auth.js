import axios from '../api/axios';

// Login
export const login = async (email, password) => {
  const response = await axios.post('/api/auth/login', { email, password });
  return response.data; // "OTP sent"
};

// Register
export const register = async (userName, email, password) => {
  const response = await axios.post('/api/v1/save', {
    userName,
    email,
    password,
    role: "USER"
  });
  return response.data;
};

// Verify OTP 
export const verifyOtp = async (email, otp) => {
  try {
    console.log("Sending verifyOtp request:", { email, otp });

    const response = await axios.post('/api/auth/verify-otp', { email, otp });

    console.log("VerifyOtp response:", response.data);

    if (response.data.token) {
   
      localStorage.setItem("authData", JSON.stringify(response.data));
    }

    return response.data;
  } catch (err) {
    console.error("VerifyOtp error:", err.response?.data || err.message);
    throw err;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('authData');
};

// Get current logged-in user/token
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('authData'));
};
