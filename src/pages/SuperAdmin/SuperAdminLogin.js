import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { superAdminLogin } from "../../api/superAdminApi";
import bgImage from "../../assets/login-bg.jpg";   

function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (email.trim() === "" || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.trim() === "") {
      setError("Password cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const data = await superAdminLogin(email, password);

      if (data?.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", "SUPER_ADMIN");
        sessionStorage.setItem("email", email);

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

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={handleClose} style={styles.closeButton}>
          &times;
        </button>

        <h2 style={styles.title}>Super Admin Login</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}

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

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
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
    // ✅ Background image added
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "10px",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    background: "rgba(255,255,255,0.92)",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    padding: "40px 30px",
    backdropFilter: "blur(4px)",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "15px",
    background: "transparent",
    border: "none",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#999",
    cursor: "pointer",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#007bff",
    textAlign: "center",
  },
  form: {
    marginTop: "10px",
  },
  formGroup: {
    marginBottom: "18px",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "#f9f9f9",
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
  },
  error: {
    color: "red",
    marginBottom: "15px",
    fontSize: "14px",
  },
};

export default SuperAdminLogin;
