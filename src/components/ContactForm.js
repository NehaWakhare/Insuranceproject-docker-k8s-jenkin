import React, { useState } from "react";
import axios from "axios";
import "./ContactForm.css";
import { useNavigate } from "react-router-dom";

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
        if (!value.trim() && !sameAddress) error = "Permanent address is required.";
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

    // validate field on change
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

    // validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      newErrors[field] = validateField(field, formData[field]);
    });
    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return; // stop if any error

    try {
      const response = await axios.post(
        "http://localhost:8089/api/contact-form/add",
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
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="overlay">
      <div className="contact-form-page">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="close-button" onClick={() => navigate("/support")}>
            &times;
          </div>
          <h2>Register as Agent</h2>

          {/* Full Name */}
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          {/* Email */}
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          {/* DOB */}
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          {errors.dob && <p className="error-text">{errors.dob}</p>}

          {/* Mobile */}
          <label>Mobile Number</label>
          <div className="mobile-input">
            <span>+91</span>
            <input
              type="text"
              name="mobileNumber"
              placeholder="Enter 10-digit number"
              value={formData.mobileNumber}
              onChange={handleChange}
              maxLength="10"
            />
          </div>
          {errors.mobileNumber && (
            <p className="error-text">{errors.mobileNumber}</p>
          )}

          {/* Correspondence */}
          <label>Correspondence Address</label>
          <textarea
            name="correspondenceAddress"
            placeholder="Correspondence Address"
            value={formData.correspondenceAddress}
            onChange={handleChange}
          />
          {errors.correspondenceAddress && (
            <p className="error-text">{errors.correspondenceAddress}</p>
          )}

          {/* Checkbox */}
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={sameAddress}
              onChange={handleCheckboxChange}
            />
            <label>Same as correspondence address</label>
          </div>

          {/* Permanent Address */}
          <label>Permanent Address</label>
          <textarea
            name="permanentAddress"
            placeholder="Permanent Address"
            value={formData.permanentAddress}
            onChange={handleChange}
            disabled={sameAddress}
          />
          {errors.permanentAddress && (
            <p className="error-text">{errors.permanentAddress}</p>
          )}

          {/* PAN */}
          <label>PAN Number</label>
          <input
            type="text"
            name="panNumber"
            placeholder="PAN Number"
            value={formData.panNumber}
            onChange={handleChange}
            maxLength="10"
          />
          {errors.panNumber && <p className="error-text">{errors.panNumber}</p>}

          {/* Role */}
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          {errors.role && <p className="error-text">{errors.role}</p>}

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
