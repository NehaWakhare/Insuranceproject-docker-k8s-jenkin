import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8089",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request URL:", config.url);
    console.log("Request headers before interceptor:", config.headers);

    // Skip token for registration & login APIs
    if (
      !config.url.includes("/api/v1/save") && // registration
      !config.url.includes("/api/auth/login") && // login
      !config.url.includes("/api/auth/verify-otp") // otp verify
    ) {
      const authData = JSON.parse(localStorage.getItem("authData"));
      const token = authData?.token;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    console.log("Request headers after interceptor:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("401 detected → clearing auth and redirecting to login");
      localStorage.removeItem("authData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
