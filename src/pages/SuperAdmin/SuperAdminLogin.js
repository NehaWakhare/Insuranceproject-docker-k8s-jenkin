import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { superAdminLogin } from "../../api/superAdminApi";

function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔹 Call API
      const data = await superAdminLogin(email, password);

      // 🔹 Save token & role
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || "SUPERADMIN");

        // 🔹 Redirect to dashboard
        navigate("/superadmin/dashboard", { replace: true });
      } else {
        throw new Error("Login failed: No token received");
      }
    } catch (err) {
      setError(err.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Super Admin Login
          </h2>
          <form onSubmit={handleSubmit}>
            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter email"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Password</label>
              <div style={styles.passwordField}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  style={{ ...styles.input, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.toggleBtn}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: "url('/images/S-login.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "350px",
    padding: "30px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
  },
  formGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  passwordField: {
    display: "flex",
    alignItems: "center",
  },
  toggleBtn: {
    marginLeft: "8px",
    padding: "8px",
    border: "none",
    cursor: "pointer",
    background: "transparent",
    fontSize: "18px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
  },
};

export default SuperAdminLogin;
