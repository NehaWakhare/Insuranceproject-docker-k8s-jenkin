import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8089",
  headers: { "Content-Type": "application/json" },
});

// Add token for protected routes
axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.url.includes("/api/admin/register") &&
        !config.url.includes("/api/admin/login") &&
        !config.url.includes("/api/admin/verify-otp")) {
      const token = sessionStorage.getItem("adminToken");
      if (token) config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login API
export const login = async (email, password) => {
  const res = await axiosInstance.post("/api/admin/login", { email, password });
  return res.data;
};

// Verify OTP API
export const verifyOtp = async (email, otp, password) => {
  const res = await axiosInstance.post("/api/admin/verify-otp", { email, otp, password });
  return res.data;
};

export default axiosInstance;
