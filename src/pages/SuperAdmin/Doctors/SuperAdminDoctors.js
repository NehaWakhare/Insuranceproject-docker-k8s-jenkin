import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function SuperAdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    doctorName: "",
    specialization: "",
    status: "Available",
    availableTime: "",
    email: "",
  });

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8089/api/doctors/self");
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = async () => {
    try {
      await fetch("http://localhost:8089/api/doctors/save/self", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoctor),
      });
      setOpen(false);
      fetchDoctors();
    } catch (err) {
      console.error("Error adding doctor:", err);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await fetch(`http://localhost:8089/api/doctors/${id}`, {
        method: "DELETE",
      });
      fetchDoctors();
    } catch (err) {
      console.error("Error deleting doctor:", err);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Doctors Management</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        style={{ marginBottom: "15px" }}
      >
        Add Doctor
      </Button>

      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <TableContainer component={Paper} style={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Doctor Name</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Available Time</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doc, index) => (
                <TableRow
                  key={doc.id}
                  hover
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/superadmin/dashboard/doctors/${doc.id}`)}
                >
                  <TableCell>{doc.id}</TableCell>
                  <TableCell>{doc.doctorName}</TableCell>
                  <TableCell>{doc.specialization}</TableCell>
                  <TableCell>
                    <Chip
                      label={doc.status}
                      color={doc.status === "Available" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{doc.availableTime}</TableCell>
                  <TableCell>{doc.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDoctor(doc.id);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Doctor</DialogTitle>
        <DialogContent>
          <TextField
            label="Doctor Name"
            fullWidth
            margin="normal"
            value={newDoctor.doctorName}
            onChange={(e) => setNewDoctor({ ...newDoctor, doctorName: e.target.value })}
          />
          <TextField
            label="Specialization"
            fullWidth
            margin="normal"
            value={newDoctor.specialization}
            onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
          />
          <TextField
            label="Status"
            fullWidth
            margin="normal"
            value={newDoctor.status}
            onChange={(e) => setNewDoctor({ ...newDoctor, status: e.target.value })}
          />
          <TextField
            label="Available Time"
            fullWidth
            margin="normal"
            value={newDoctor.availableTime}
            onChange={(e) => setNewDoctor({ ...newDoctor, availableTime: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={newDoctor.email}
            onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddDoctor}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
