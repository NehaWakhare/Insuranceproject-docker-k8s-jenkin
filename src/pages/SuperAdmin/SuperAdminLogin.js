import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { superAdminLogin } from "../../api/superAdminApi";

function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await superAdminLogin(email, password);
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "SUPER_ADMIN");
        localStorage.setItem("email", email);
        navigate("/superadmin/dashboard", { replace: true });
      } else {
        throw new Error("Login failed: No token received");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.cardWrapper,
          flexDirection: isMobile ? "column" : "row",
          width: isMobile ? "95%" : "950px",
        }}
      >
        {/* Left: Form */}
        <div style={{ ...styles.left, padding: isMobile ? "30px 20px" : "50px 40px" }}>
          <h2 style={styles.title}>SUPER ADMIN LOGIN</h2>
          <p style={styles.subtitle}>Access the super admin control panel</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <p style={styles.error}>{error}</p>}

            {/* Email */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={styles.input}
              />
            </div>

            {/* Password */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={styles.input}
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Logging in..." : "Login Now"}
            </button>
          </form>
        </div>

        {/* Right: Animated Theme */}
        <div
          style={{
            ...styles.right,
            minHeight: isMobile ? "300px" : "auto",
          }}
        >
          {/* Floating Shapes */}
          <div style={styles.circle1}></div>
          <div style={styles.circle2}></div>

          <div style={styles.rightContent}>
            <img
              src="https://undraw.co/api/illustrations/secure_login.svg"
              alt="Super Admin Illustration"
              style={{
                ...styles.illustration,
                width: isMobile ? "60%" : "75%",
              }}
            />
            <h2 style={styles.rightTitle}>Welcome Super Admin</h2>
            <p style={styles.rightSubtitle}>
              Manage users, settings, and security all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa", // light gray
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "10px",
  },
  cardWrapper: {
    display: "flex",
    background: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
  },
  left: {
    flex: 1,
    background: "#fff",
  },
  right: {
    flex: 1,
    position: "relative",
    background: "linear-gradient(135deg, #007bff, #0056b3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    overflow: "hidden",
  },
  rightContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    padding: "20px",
  },
  illustration: {
    marginBottom: "20px",
  },
  rightTitle: {
    fontSize: "24px",
    fontWeight: "700",
  },
  rightSubtitle: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#e0e0e0",
  },
  circle1: {
    position: "absolute",
    top: "50px",
    left: "40px",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    animation: "pulse 4s infinite ease-in-out",
  },
  circle2: {
    position: "absolute",
    bottom: "60px",
    right: "40px",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    animation: "bounce 6s infinite ease-in-out",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#007bff",
  },
  subtitle: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "25px",
  },
  form: {
    marginTop: "20px",
  },
  formGroup: {
    marginBottom: "20px",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    background: "#f9f9f9",
    transition: "all 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  error: {
    color: "red",
    marginBottom: "15px",
    fontSize: "14px",
  },
};

// Simple animations
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `@keyframes pulse { 
    0% { transform: scale(1); opacity: 0.5; } 
    50% { transform: scale(1.2); opacity: 0.8; } 
    100% { transform: scale(1); opacity: 0.5; } 
  }`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `@keyframes bounce { 
    0%, 100% { transform: translateY(0); } 
    50% { transform: translateY(-20px); } 
  }`,
  styleSheet.cssRules.length
);

export default SuperAdminLogin;
