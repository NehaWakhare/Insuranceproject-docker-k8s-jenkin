import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  CircularProgress,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { DatePicker, TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [form, setForm] = useState({
    userProfileId: "",
    appointmentDate: dayjs(),
    appointmentTime: dayjs(),
    age: "",
    gender: "",
    weight: "",
    reason: "",
  });

  // Fetch doctor details & appointments
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const docRes = await fetch(`http://localhost:8089/api/doctors/${id}`);
        const docData = await docRes.json();
        setDoctor(docData);

        const apptRes = await fetch(`http://localhost:8089/appointments/doctor/${id}`);
        const apptData = await apptRes.json();
        setAppointments(Array.isArray(apptData) ? apptData : []);
      } catch (err) {
        console.error("Error fetching doctor details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBookAppointment = async () => {
    const payload = {
      doctorId: id,
      userProfileId: form.userProfileId,
      appointmentDate: form.appointmentDate.format("YYYY-MM-DD"),
      appointmentTime: form.appointmentTime.format("HH:mm"),
      age: form.age,
      gender: form.gender,
      weight: form.weight,
      reason: form.reason,
    };

    try {
      const res = await fetch("http://localhost:8089/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const resultText = await res.text();
      setSnackbar({ open: true, message: resultText, severity: "success" });
      setOpenModal(false);

      // Refresh appointments
      const apptRes = await fetch(`http://localhost:8089/appointments/doctor/${id}`);
      const apptData = await apptRes.json();
      setAppointments(Array.isArray(apptData) ? apptData : []);
    } catch (err) {
      console.error("Booking error:", err);
      setSnackbar({ open: true, message: "Failed to book appointment", severity: "error" });
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (!doctor) return <Typography>Doctor not found.</Typography>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 950, mx: "auto", mt: 5, p: 3 }}>
        {/* Doctor Card */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar sx={{ width: 90, height: 90, bgcolor: "#2196f3", fontSize: "2rem" }}>
              {doctor.doctorName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>{doctor.doctorName}</Typography>
              <Typography color="text.secondary">{doctor.specialization}</Typography>
              <Typography color="text.secondary">Location: {doctor.location}</Typography>
              <Typography color={doctor.status === "Available" ? "green" : "red"}>
                Status: {doctor.status}
              </Typography>
              <Typography color="text.secondary">
                Total Appointments: {appointments.length}
              </Typography>
            </Box>
            <Box ml="auto">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenModal(true)}
                disabled={doctor.status !== "Available"}
              >
                Book Appointment
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Appointment Table */}
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Booked Appointments</Typography>
        <Divider sx={{ mb: 2 }} />
        {appointments.length === 0 ? (
          <Typography>No appointments booked yet.</Typography>
        ) : (
          <Paper sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f0f4f8" }}>
                <TableRow>
                  <TableCell><b>ID</b></TableCell>
                  <TableCell><b>User ID</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Time</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>{appt.id}</TableCell>
                    <TableCell>{appt.userProfileId}</TableCell>
                    <TableCell>{appt.appointmentDate}</TableCell>
                    <TableCell>{appt.appointmentTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* Booking Modal */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField label="User ID" name="userProfileId" value={form.userProfileId} onChange={handleFormChange} required fullWidth />
              <DatePicker label="Appointment Date" value={form.appointmentDate} onChange={(date) => setForm({ ...form, appointmentDate: date })} />
              <TimePicker label="Appointment Time" value={form.appointmentTime} onChange={(time) => setForm({ ...form, appointmentTime: time })} />
              <TextField label="Age" name="age" type="number" value={form.age} onChange={handleFormChange} fullWidth />
              <TextField label="Gender" name="gender" value={form.gender} onChange={handleFormChange} fullWidth />
              <TextField label="Weight (kg)" name="weight" type="number" value={form.weight} onChange={handleFormChange} fullWidth />
              <TextField label="Reason" name="reason" value={form.reason} onChange={handleFormChange} fullWidth multiline rows={2} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleBookAppointment}>Confirm</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}

