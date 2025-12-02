import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import CONFIG from "../../../config/config";

export default function AdminRegistration() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    panNumber: "",
    mobileNumber: "+91",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Username — only alphabets & space
    if (name === "username") {
      updatedValue = value.replace(/[^A-Za-z\s]/g, "");
    }

    // Email — allow only valid chars
    if (name === "email") {
      updatedValue = value.replace(/[^a-zA-Z0-9@._-]/g, "");
    }

    // PAN — only alphanumeric & uppercase
    if (name === "panNumber") {
      updatedValue = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    }

    // Mobile number — always start with +91 and restrict special chars
    if (name === "mobileNumber") {
      let num = value.replace(/\D/g, "");
      if (!num.startsWith("91")) num = "91" + num;
      num = num.slice(0, 12); // 91 + 10 digits
      updatedValue = "+" + num;
    }

    setFormData({ ...formData, [name]: updatedValue });
    setValidationErrors({ ...validationErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const mobileRegex = /^\+91[6-9]\d{9}$/;

    if (!formData.username.trim()) {
      errors.username = "Username is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!formData.panNumber.trim()) {
      errors.panNumber = "PAN number is required.";
    } else if (!panRegex.test(formData.panNumber)) {
      errors.panNumber = "Invalid PAN format (e.g., ABCDE1234F).";
    }

    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = "Mobile number is required.";
    } else if (!mobileRegex.test(formData.mobileNumber)) {
      errors.mobileNumber =
        "Invalid mobile number (must start with +91 and 10 digits).";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!validateForm()) return;

    try {
      await axios.post(`${CONFIG.BASE_URL}/admin/register`, formData);
      setSuccessMsg(
        `🎉 Admin registered successfully! Email sent to ${formData.email}`
      );
      setFormData({
        username: "",
        email: "",
        panNumber: "",
        mobileNumber: "+91",
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      setErrorMsg(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500, margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom>
        📝 Register Admin
      </Typography>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!validationErrors.username}
          helperText={validationErrors.username}
        />

        <TextField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!validationErrors.email}
          helperText={validationErrors.email}
        />

        <TextField
          label="PAN Number"
          name="panNumber"
          value={formData.panNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!validationErrors.panNumber}
          helperText={validationErrors.panNumber}
        />

        <TextField
          label="Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!validationErrors.mobileNumber}
          helperText={validationErrors.mobileNumber}
          inputProps={{ maxLength: 13 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          fullWidth
        >
          Register Admin
        </Button>
      </form>
    </Box>
  );
}
