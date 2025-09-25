import React, { useEffect, useState } from "react";

export default function AdminApprovals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8089/api/admin/pending");
      if (!res.ok) throw new Error("Failed to fetch pending admins");
      const data = await res.json();
      setRequests(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:8089/api/admin/approve/${id}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to approve admin");
      await fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:8089/api/admin/reject/${id}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to reject admin");
      await fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p style={styles.info}>⏳ Loading requests...</p>;
  if (error) return <p style={{ ...styles.info, color: "red" }}>⚠️ {error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Pending Admin Approvals</h2>
      {requests.length === 0 ? (
        <p style={styles.info}>✅ No pending requests</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>Username</th>
                <th>Email</th>
                <th>GST No</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} style={styles.row}>
                  <td>{req.username}</td>
                  <td>{req.email}</td>
                  <td>{req.gstNumber}</td>
                  <td>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          req.status === "PENDING" ? "#ff9800" : "#4caf50",
                      }}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleApprove(req.id)}
                    >
                      ✅ Approve
                    </button>
                    <button
                      style={styles.rejectBtn}
                      onClick={() => handleReject(req.id)}
                    >
                      ❌ Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "25px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
    marginTop: "20px",
  },
  heading: { marginBottom: "15px", fontSize: "22px", fontWeight: "600" },
  info: { fontSize: "16px", color: "#666", marginTop: "10px" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "15px" },
  tableHeader: { background: "#1976d2", color: "#fff", textAlign: "left" },
  row: { borderBottom: "1px solid #ddd" },
  badge: {
    padding: "3px 8px",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
  },
  approveBtn: {
    background: "#4CAF50",
    color: "white",
    border: "none",
    padding: "6px 12px",
    marginRight: "8px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  rejectBtn: {
    background: "#f44336",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
};
