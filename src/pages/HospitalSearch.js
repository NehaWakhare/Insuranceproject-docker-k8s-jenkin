import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CONFIG from "../config/config";

import {
  Box,
  Button,
  Modal,
  Typography,
  IconButton,
  TextField,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function HospitalSearch() {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openDoctorModal, setOpenDoctorModal] = useState(false);
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    doctorId: "",
    userProfileId: "",
    appointmentDate: "",
    age: "",
    gender: "",
    weight: "",
    reason: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const BASE_URL = CONFIG.BASE_URL; // ✅ base URL from config

  // Fetch hospitals
  useEffect(() => {
    axios
      .get(`${BASE_URL}/hospitals/all`)
      .then((res) => setHospitals(res.data))
      .catch((err) => console.error("Failed to fetch hospitals:", err));
  }, []);

  // Fetch doctors by hospital
  const fetchDoctors = async (hospitalId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/doctors/hospital/${hospitalId}`
      );
      setDoctors(res.data);
      setOpenDoctorModal(true);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    }
  };

  // Book button click
  const handleBook = (doctor) => {
    const profileId = sessionStorage.getItem("userProfileId");

    if (!profileId) {
      alert("Please complete your profile before booking an appointment.");
      window.location.href = "/dashboard/profile";
      return;
    }

    setSelectedDoctor(doctor);
    setFormData({
      doctorId: doctor.id,
      userProfileId: Number(profileId),
      appointmentDate: "",
      age: "",
      gender: "",
      weight: "",
      reason: "",
    });
    setOpenAppointmentModal(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const {
      doctorId,
      userProfileId,
      appointmentDate,
      age,
      gender,
      weight,
      reason,
    } = formData;

    if (
      !doctorId ||
      !userProfileId ||
      !appointmentDate ||
      !age ||
      !gender ||
      !weight ||
      !reason
    ) {
      setErrorMsg("All fields are required.");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/appointments/book`, formData);
      setSuccessMsg("Appointment booked successfully!");
      setErrorMsg("");

      setTimeout(() => {
        setOpenAppointmentModal(false);
        setSuccessMsg("");
        navigate("/dashboard/appointments");
      }, 1500);
    } catch (error) {
      console.error("Booking error:", error);
      setErrorMsg("Failed to book appointment.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#1e40af" }}>
        🏥 Available Hospitals
      </Typography>

      {/* Hospitals Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 2,
        }}
      >
        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <Box
              key={hospital.id}
              sx={{
                background: "#fff",
                p: 2,
                borderRadius: 2,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <Typography variant="h6" color="primary">
                {hospital.hospitalName}
              </Typography>
              <Typography>📍 {hospital.city || "City not specified"}</Typography>
              <Typography>🩺 {hospital.speciality || "Speciality not specified"}</Typography>
              <Typography>☎️ {hospital.contactNumber || "No contact info"}</Typography>

              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => fetchDoctors(hospital.id)}
              >
                View Doctors
              </Button>
            </Box>
          ))
        ) : (
          <Typography>No hospitals found.</Typography>
        )}
      </Box>

      {/* Doctor Modal */}
      <Modal
        open={openDoctorModal}
        onClose={() => setOpenDoctorModal(false)}
        BackdropProps={{
          style: { backdropFilter: "blur(6px)" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            width: "600px",
            p: 3,
            borderRadius: 2,
            boxShadow: 5,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">👨‍⚕️ Doctors</Typography>
            <IconButton onClick={() => setOpenDoctorModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {doctors.length > 0 ? (
            doctors.map((doc) => (
              <Box
                key={doc.id}
                sx={{
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography fontWeight="bold">{doc.doctorName}</Typography>
                  <Typography>{doc.specialization}</Typography>
                  <Typography color="text.secondary">
                    ⏰ {doc.availableTime || "N/A"}
                  </Typography>
                </Box>
                <Button variant="outlined" onClick={() => handleBook(doc)}>
                  Book Appointment
                </Button>
              </Box>
            ))
          ) : (
            <Typography sx={{ mt: 2 }}>No doctors available.</Typography>
          )}
        </Box>
      </Modal>

      {/* Appointment Modal */}
      <Modal
        open={openAppointmentModal}
        onClose={() => setOpenAppointmentModal(false)}
        BackdropProps={{
          style: { backdropFilter: "blur(6px)" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            width: 400,
            p: 3,
            borderRadius: 2,
            boxShadow: 5,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">
              📅 Book Appointment with {selectedDoctor?.doctorName}
            </Typography>
            <IconButton onClick={() => setOpenAppointmentModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {errorMsg && <Alert severity="error" sx={{ mt: 1 }}>{errorMsg}</Alert>}
          {successMsg && <Alert severity="success" sx={{ mt: 1 }}>{successMsg}</Alert>}

          <TextField
            label="Appointment Date"
            name="appointmentDate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
            value={formData.appointmentDate}
            onChange={handleChange}
          />
          <TextField
            label="Age"
            name="age"
            fullWidth
            sx={{ mt: 2 }}
            value={formData.age}
            onChange={handleChange}
          />
          <TextField
            label="Gender"
            name="gender"
            fullWidth
            sx={{ mt: 2 }}
            value={formData.gender}
            onChange={handleChange}
          />
          <TextField
            label="Weight"
            name="weight"
            fullWidth
            sx={{ mt: 2 }}
            value={formData.weight}
            onChange={handleChange}
          />
          <TextField
            label="Reason"
            name="reason"
            fullWidth
            sx={{ mt: 2 }}
            value={formData.reason}
            onChange={handleChange}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Confirm Booking
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
