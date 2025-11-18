import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CONFIG from "../../../config/config";

export default function IndependentDoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const [formData, setFormData] = useState({
    doctorName: "",
    specialization: "",
    status: "",
    availableTime: "",
    email: "",
  });

  const API_BASE = CONFIG.BASE_URL; 

  // Fetch all doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/doctors/self`);
      if (Array.isArray(response.data)) setDoctors(response.data);
      else setDoctors([]);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to fetch doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setErrorMsg("");
    setSuccessMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddModal = () => {
    setEditMode(false);
    setSelectedDoctorId(null);
    setFormData({
      doctorName: "",
      specialization: "",
      status: "",
      availableTime: "",
      email: "",
    });
    setOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditMode(true);
    setSelectedDoctorId(doctor.id);
    setFormData({
      doctorName: doctor.doctorName,
      specialization: doctor.specialization,
      status: doctor.status,
      availableTime: doctor.availableTime,
      email: doctor.email,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    const { doctorName, specialization, status, availableTime, email } = formData;
    if (!doctorName || !specialization || !status || !availableTime || !email) {
      setErrorMsg("All fields are required.");
      return;
    }

    try {
      if (editMode) {
        const res = await axios.put(
          `${API_BASE}/api/doctors/update/self/${selectedDoctorId}`,
          formData
        );
        setDoctors((prev) =>
          prev.map((doc) => (doc.id === selectedDoctorId ? res.data : doc))
        );
        setSuccessMsg("Doctor updated successfully!");
      } else {
        const res = await axios.post(`${API_BASE}/api/doctors/save/self`, formData);
        setDoctors((prev) => [...prev, res.data]);
        setSuccessMsg("Doctor added successfully!");
      }

      setFormData({ doctorName: "", specialization: "", status: "", availableTime: "", email: "" });
      setOpen(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error(error);
      setErrorMsg("Operation failed. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await axios.delete(`${API_BASE}/api/doctors/${id}`);
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
      setSuccessMsg("Doctor deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to delete doctor.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">🧑‍⚕️ Independent Doctor List</Typography>
        <Button variant="contained" onClick={handleAddModal}>
          + Add Doctor
        </Button>
      </Box>

      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Doctor Name</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Available Time</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {doctors.length > 0 ? (
                doctors.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.doctorName}</TableCell>
                    <TableCell>{doc.specialization}</TableCell>
                    <TableCell>{doc.status}</TableCell>
                    <TableCell>{doc.availableTime}</TableCell>
                    <TableCell>{doc.email}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditDoctor(doc)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(doc.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No doctors found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 400,
            bgcolor: "#fff",
            p: 3,
            borderRadius: 2,
            boxShadow: 4,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editMode ? "Edit Doctor" : "Add New Doctor"}
          </Typography>

          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

          <TextField fullWidth name="doctorName" label="Doctor Name" value={formData.doctorName} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth name="specialization" label="Specialization" value={formData.specialization} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth name="status" label="Status" value={formData.status} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth name="availableTime" label="Available Time" value={formData.availableTime} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth name="email" label="Email" value={formData.email} onChange={handleChange} sx={{ mb: 2 }} />

          <Button variant="contained" fullWidth onClick={handleSubmit} sx={{ mt: 1 }}>
            {editMode ? "Update Doctor" : "Add Doctor"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
