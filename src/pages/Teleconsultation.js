import React, { useEffect, useState } from "react";
import axios from "axios";
import CONFIG from "../config/config";
import { useNavigate } from "react-router-dom";

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

export default function Teleconsultation() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loginMsg, setLoginMsg] = useState("");

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

  const BASE_URL = CONFIG.BASE_URL; // ✅ base URL from config

  // Fetch teleconsultation doctors
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/doctors/self`) 
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  // Book appointment
  const handleBook = (doctor) => {
    const profileId = sessionStorage.getItem("userProfileId");

    if (!profileId) {
      alert("Please complete your profile before booking an appointment.");
      return navigate("/dashboard/profile");
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

    setOpenModal(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const { doctorId, userProfileId, appointmentDate, age, gender, weight, reason } =
      formData;

    if (!doctorId || !userProfileId || !appointmentDate || !age || !gender || !weight || !reason) {
      setErrorMsg("All fields are required.");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/appointments/book`, formData); 
      setSuccessMsg("Teleconsultation booked successfully!");
      setErrorMsg("");

      setTimeout(() => {
        setOpenModal(false);
        navigate("/dashboard/appointments");
      }, 1500);
    } catch (error) {
      console.error("Booking error:", error);
      setErrorMsg("Failed to book teleconsultation.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1e40af", mb: 2 }}>
        🩺 Teleconsultation Doctors
      </Typography>

      {/* Doctor Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 2,
        }}
      >
        {doctors.length > 0 ? (
          doctors.map((doc) => (
            <Box
              key={doc.id}
              sx={{
                background: "#fff",
                p: 2,
                borderRadius: 2,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
                transition: "0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <Typography variant="h6" color="primary">
                {doc.doctorName}
              </Typography>
              <Typography>{doc.specialization}</Typography>
              <Typography color="text.secondary">
                ⏰ {doc.availableTime || "N/A"}
              </Typography>

              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => handleBook(doc)}
              >
                Book Teleconsultation
              </Button>
            </Box>
          ))
        ) : (
          <Typography>No teleconsultation doctors found.</Typography>
        )}
      </Box>

      {/* Booking Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        BackdropProps={{
          sx: { backdropFilter: "blur(5px)" },
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
              {loginMsg
                ? "⚠️ Login Required"
                : `📞 Teleconsultation with ${selectedDoctor?.doctorName}`}
            </Typography>

            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {loginMsg && <Alert severity="warning">{loginMsg}</Alert>}
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
          {successMsg && <Alert severity="success">{successMsg}</Alert>}

          {!loginMsg && (
            <>
              <TextField
                label="Appointment Date"
                name="appointmentDate"
                type="date"
                fullWidth
                sx={{ mt: 2 }}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
              <TextField label="Age" name="age" fullWidth sx={{ mt: 2 }} onChange={handleChange} />
              <TextField label="Gender" name="gender" fullWidth sx={{ mt: 2 }} onChange={handleChange} />
              <TextField label="Weight" name="weight" fullWidth sx={{ mt: 2 }} onChange={handleChange} />
              <TextField label="Reason" name="reason" fullWidth sx={{ mt: 2 }} onChange={handleChange} />

              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
                Confirm Booking
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
