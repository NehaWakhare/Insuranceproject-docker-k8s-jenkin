import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Paper,
  IconButton,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CONFIG from "../config/config";
import "./ContactForm.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    mobileNumber: "",
    correspondenceAddress: "",
    permanentAddress: "",
    panNumber: "",
    role: "",
  });

  const [sameAddress, setSameAddress] = useState(false);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required.";
        break;
      case "email":
        if (!emailRegex.test(value)) error = "Invalid email address.";
        break;
      case "dob":
        if (!value) error = "Date of birth is required.";
        else if (new Date().getFullYear() - new Date(value).getFullYear() < 18)
          error = "Age must be above 18.";
        break;
      case "mobileNumber":
        if (!mobileRegex.test(value))
          error = "Enter valid 10-digit mobile number.";
        break;
      case "correspondenceAddress":
        if (!value.trim()) error = "Correspondence address is required.";
        break;
      case "permanentAddress":
        if (!value.trim() && !sameAddress)
          error = "Permanent address is required.";
        break;
      case "panNumber":
        if (!panRegex.test(value))
          error = "Enter valid PAN number (e.g., ABCDE1234F).";
        break;
      case "role":
        if (!value) error = "Please select a role.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleCheckboxChange = () => {
    setSameAddress(!sameAddress);
    if (!sameAddress) {
      setFormData({
        ...formData,
        permanentAddress: formData.correspondenceAddress,
      });
      setErrors({ ...errors, permanentAddress: "" });
    } else {
      setFormData({ ...formData, permanentAddress: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      newErrors[field] = validateField(field, formData[field]);
    });
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e)) return;

    try {
      
      const response = await axios.post(
        `${CONFIG.BASE_URL}/api/contact-form/add`,
        formData
      );

      alert(`Registration successful! ID: ${response.data.id}`);

      setFormData({
        name: "",
        email: "",
        dob: "",
        mobileNumber: "",
        correspondenceAddress: "",
        permanentAddress: "",
        panNumber: "",
        role: "",
      });

      setSameAddress(false);
      setErrors({});
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => navigate("/support"), 400);
  };

  return (
    <Fade in={open} timeout={600}>
      <Box className="contactForm-backdrop">
        <Paper elevation={6} className="contactForm-container">
          <IconButton onClick={handleClose} className="contactForm-closeBtn">
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" align="center" className="contactForm-title">
            Register as Agent
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* all your fields same */}
            
            <Button type="submit" fullWidth variant="contained" className="contactForm-submit">
              Submit
            </Button>
          </form>
        </Paper>
      </Box>
    </Fade>
  );
}
