import React, { useEffect, useState } from "react";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TimePicker } from "@mui/x-date-pickers/TimePicker"; 
import dayjs from "dayjs"; 
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


  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/doctors/self`);
      if (Array.isArray(response.data)) setDoctors(response.data);
      else setDoctors([]);
    } catch (error) {
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

    if ((e.target.name === "doctorName" || e.target.name === "specialization") && /[^a-zA-Z\s]/.test(e.target.value)) {
      return;
    }

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

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) {
      setErrorMsg("Enter a valid email address.");
      return;
    }

    try {
      if (editMode) {
        const res = await axios.put(
          `${API_BASE}/doctors/update/self/${selectedDoctorId}`,
          formData
        );
        setDoctors((prev) =>
          prev.map((doc) => (doc.id === selectedDoctorId ? res.data : doc))
        );
        setSuccessMsg("Doctor updated successfully!");
      } else {
        const res = await axios.post(`${API_BASE}/doctors/save/self`, formData);
        setDoctors((prev) => [...prev, res.data]);
        setSuccessMsg("Doctor added successfully!");
      }

      setFormData({ doctorName: "", specialization: "", status: "", availableTime: "", email: "" });
      setOpen(false);
      setTimeout(() => setSuccessMsg(""), 3000);

    } catch {
      setErrorMsg("Operation failed. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await axios.delete(`${API_BASE}/doctors/${id}`);
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
      setSuccessMsg("Doctor deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setErrorMsg("Failed to delete doctor.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">🧑‍⚕️ Independent Doctor List</Typography>
        <Button variant="contained" onClick={handleAddModal}>+ Add Doctor</Button>
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
              {doctors.length > 0 ? doctors.map((doc) => (
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
              )) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No doctors found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ⭐ Modal with Background Blur Added */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        BackdropProps={{
          sx: { backdropFilter: "blur(5px)" }   // 👈 Background blur
        }}
      >
        <Box sx={{
          width: 400, bgcolor: "#fff", p: 3, borderRadius: 2, boxShadow: 4,
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editMode ? "Edit Doctor" : "Add New Doctor"}
          </Typography>

          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

          <TextField
            fullWidth label="Doctor Name" name="doctorName" value={formData.doctorName}
            onChange={handleChange} sx={{ mb: 2 }}
          />

          <TextField
            fullWidth label="Specialization" name="specialization" value={formData.specialization}
            onChange={handleChange} sx={{ mb: 2 }}
          />

          <TextField select fullWidth label="Status" name="status" value={formData.status}
            onChange={handleChange} sx={{ mb: 2 }}>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Available Time"
              value={formData.availableTime ? dayjs(formData.availableTime, "HH:mm") : null}
              onChange={(newValue) =>
                setFormData({ ...formData, availableTime: dayjs(newValue).format("HH:mm") })
              }
              sx={{ width: "100%", mb: 2 }}
            />
          </LocalizationProvider>

          <TextField
            fullWidth type="email" label="Email" name="email" value={formData.email}
            onChange={handleChange} sx={{ mb: 2 }}
          />

          <Button variant="contained" fullWidth onClick={handleSubmit}>
            {editMode ? "Update Doctor" : "Add Doctor"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
