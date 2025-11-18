import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
import CONFIG from "../../../config/config";

export default function AdminDetails() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${CONFIG.BASE_URL}/api/contact-form/all`);
      if (!res.ok) throw new Error("Failed to fetch admin requests");
      const data = await res.json();
      setRequests(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);
  
  if (loading) return <p style={styles.info}>⏳ Loading admin data...</p>;
  if (error) return <p style={{ ...styles.info, color: "red" }}>⚠️ {error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Registration Details</h2>

      {requests.length === 0 ? (
        <p style={styles.info}>✅ No admin records found</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={styles.th}>ID</TableCell>
                <TableCell style={styles.th}>Name</TableCell>
                <TableCell style={styles.th}>Email</TableCell>
                <TableCell style={styles.th}>DOB</TableCell>
                <TableCell style={styles.th}>Mobile</TableCell>
                <TableCell style={styles.th}>Correspondence Address</TableCell>
                <TableCell style={styles.th}>Permanent Address</TableCell>
                <TableCell style={styles.th}>PAN Number</TableCell>
                <TableCell style={styles.th}>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} hover>
                  <TableCell style={styles.td}>{req.id}</TableCell>
                  <TableCell style={styles.td}>{req.name}</TableCell>
                  <TableCell style={styles.td}>{req.email}</TableCell>
                  <TableCell style={styles.td}>{req.dob}</TableCell>
                  <TableCell style={styles.td}>{req.mobileNumber}</TableCell>
                  <TableCell style={styles.td}>{req.correspondenceAddress}</TableCell>
                  <TableCell style={styles.td}>{req.permanentAddress}</TableCell>
                  <TableCell style={styles.td}>{req.panNumber}</TableCell>
                  <TableCell style={styles.td}>
                    <Chip label={req.role} color="primary" size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    padding: "20px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
  },

  heading: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#1e3a8a",
    textAlign: "center",
  },

  info: {
    fontSize: "16px",
    color: "#555",
    textAlign: "center",
    marginTop: "10px",
  },

  th: {
    backgroundColor: "#1e40af",
    color: "#fff",
    fontWeight: "bold",
    borderRight: "1px solid #ddd",
  },

  td: {
    borderRight: "1px solid #ddd",
    padding: "10px",
  },
};
