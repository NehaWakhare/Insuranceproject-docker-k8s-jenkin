import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import CONFIG from "../../../config/config"; // ✅ Import config

export default function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    hospitalName: "",
    city: "",
    speciality: "",
    contactNumber: "",
  });
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");
  
  const API_BASE = CONFIG.BASE_URL; // ✅ Base URL from config

  const showMsg = (message) => {
    setMsg(message);
    setTimeout(() => setMsg(""), 3000);
  };

  const getHospitals = async () => {
    try {
      const res = await fetch(`${API_BASE}/hospitals/all`, {  // ✅ Use BASE_URL
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHospitals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHospitals();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditMode(false);
    setFormData({ hospitalName: "", city: "", speciality: "", contactNumber: "" });
    setOpen(true);
  };

  const handleEdit = (hospital) => {
    setEditMode(true);
    setSelectedId(hospital.id);
    setFormData({
      hospitalName: hospital.hospitalName,
      city: hospital.city,
      speciality: hospital.speciality,
      contactNumber: hospital.contactNumber,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital?")) return;

    try {
      const response = await fetch(`${API_BASE}/hospitals/delete/${id}`, { // ✅ BASE_URL
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete failed:", errorText);
        alert("❌ Failed to delete hospital.");
        return;
      }

      showMsg("✅ Hospital deleted successfully");
      setHospitals((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error("Error deleting hospital:", err);
      alert("❌ Failed to delete hospital.");
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await fetch(`${API_BASE}/hospitals/update/${selectedId}`, { // ✅ BASE_URL
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        showMsg("✅ Hospital updated successfully");
      } else {
        await fetch(`${API_BASE}/hospitals/add`, { // ✅ BASE_URL
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        showMsg("✅ Hospital added successfully");
      }

      setOpen(false);
      getHospitals();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        🏥 Hospital List
      </Typography>

      {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Add Hospital
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#1e40af" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Hospital Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>City</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Speciality</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Contact Number</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {hospitals.length > 0 ? (
              hospitals.map((hosp) => (
                <TableRow key={hosp.id} hover>
                  <TableCell>{hosp.id}</TableCell>
                  <TableCell>{hosp.hospitalName}</TableCell>
                  <TableCell>{hosp.city}</TableCell>
                  <TableCell>{hosp.speciality}</TableCell>
                  <TableCell>{hosp.contactNumber}</TableCell>

                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(hosp)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton color="error" onClick={() => handleDelete(hosp.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hospitals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editMode ? "Edit Hospital" : "Add New Hospital"}</DialogTitle>

        <DialogContent>
          <TextField
            label="Hospital Name"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Speciality"
            name="speciality"
            value={formData.speciality}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editMode ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
