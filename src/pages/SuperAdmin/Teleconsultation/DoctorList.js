
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { getAuthHeaders } from "../../../api/superAdminApi";
import CONFIG from "../../../config/config";
const API_BASE = CONFIG.BASE_URL;


export default function DoctorsByHospital() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [error, setError] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState({
    doctorName: "",
    specialization: "",
    status: "",
    availableTime: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

 

  const fetchHospitals = async () => {
    try {
      const res = await axios.get(`${API_BASE}/hospitals/all`, { headers: getAuthHeaders() });
      setHospitals(Array.isArray(res.data) ? res.data : []);
      if (res.data?.length) setSelectedHospital((prev) => prev || res.data[0].id);
    } catch (err) {
      console.error("Fetch hospitals", err);
    }
  };

  const fetchDoctorsByHospital = async (hospitalId) => {
    if (!hospitalId) return setDoctors([]);
    setLoadingDoctors(true);
    try {
      const res = await axios.get(`${API_BASE}/api/doctors/hospital/${hospitalId}`, { headers: getAuthHeaders() });
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch doctors by hospital", err);
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchHospitals();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedHospital) fetchDoctorsByHospital(selectedHospital);
  }, [selectedHospital]);

  const openAdd = () => {
    setIsEdit(false);
    setEditingDoctor(null);
    setForm({ doctorName: "", specialization: "", status: "Active", availableTime: "", email: "" });
    setOpenDialog(true);
  };

  const openEdit = (doc) => {
    setIsEdit(true);
    setEditingDoctor(doc);
    setForm({
      doctorName: doc.doctorName || "",
      specialization: doc.specialization || "",
      status: doc.status || "Active",
      availableTime: doc.availableTime || "",
      email: doc.email || "",
    });
    setOpenDialog(true);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.doctorName.trim()) return "Name required";
    if (!form.specialization.trim()) return "Specialization required";
    return null;
  };

  //  FIXED handleSave for update/add doctor under hospital
  const handleSave = async () => {
    const v = validate();
    if (v) return setError(v);
    if (!selectedHospital) return setError("Select a hospital first");
    setSaving(true);
    setError(""); 
    try {
      if (isEdit && editingDoctor?.id) {
        
        const res = await axios.put(
          `${API_BASE}/api/doctors/update/${selectedHospital}/${editingDoctor.id}`,
          form,
          { headers: getAuthHeaders() }
        );

        // update doctor in UI immediately
        setDoctors((prev) =>
          prev.map((doc) => (doc.id === editingDoctor.id ? res.data : doc))
        );
      } else {
        //  add new doctor under hospital
        const res = await axios.post(
          `${API_BASE}/api/doctors/save/${selectedHospital}`,
          form,
          { headers: getAuthHeaders() }
        );

        setDoctors((prev) => [...prev, res.data]);
      }

      setOpenDialog(false);
      setForm({ doctorName: "", specialization: "", status: "Active", availableTime: "", email: "" });
    } catch (err) {
      console.error("Save error", err);
      setError("Failed to save doctor. Check all fields.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      await axios.delete(`${API_BASE}/api/doctors/${id}`, { headers: getAuthHeaders() });
      fetchDoctorsByHospital(selectedHospital);
    } catch (err) {
      console.error("Delete doctor", err);
      alert("Failed to delete doctor");
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
        <Typography variant="h6">Doctors by Hospital</Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <Select
            value={selectedHospital || ""}
            onChange={(e) => setSelectedHospital(e.target.value)}
            size="small"
            sx={{ minWidth: 220 }}
          >
            {hospitals.map((h) => (
              <MenuItem key={h.id} value={h.id}>
                {h.hospitalName} — {h.city}
              </MenuItem>
            ))}
          </Select>

          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} disabled={!selectedHospital}>
            Add Doctor
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box textAlign="center" py={6}>
          <CircularProgress />
        </Box>
      ) : loadingDoctors ? (
        <Box textAlign="center" py={6}>
          <CircularProgress />
        </Box>
      ) : doctors.length === 0 ? (
        <Typography>No doctors for this hospital.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Available</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.doctorName}</TableCell>
                  <TableCell>{d.specialization}</TableCell>
                  <TableCell>{d.email}</TableCell>
                  <TableCell>{d.status}</TableCell>
                  <TableCell>{d.availableTime}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => openEdit(d)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(d.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog fullScreen={fullScreen} open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField label="Name" name="doctorName" value={form.doctorName} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Specialization" name="specialization" value={form.specialization} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Status" name="status" value={form.status} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Available Time" name="availableTime" value={form.availableTime} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={18} /> : isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
