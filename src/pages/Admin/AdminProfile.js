import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../pages/Admin/AdminProfile.css";
import { saveAdminProfile, getAdminProfile, updateAdminProfile } from "../AdminAPI/AdminProfileAPI";
 
export default function AdminProfileForm() {
  const [mode, setMode] = useState("loading"); // "loading", "create", "view", "edit"
  const [profileId, setProfileId] = useState(null);
 
 
  const adminId = sessionStorage.getItem("adminId");
  const profileKey = `profileId_${adminId}`;
 
  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      dateOfBirth: "",
      companyName: "",
      companyType: "",
      panNumber: "",
      gstNumber: "",
      headOfficeAddress: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(8).required("Password is required"),
      phoneNumber: Yup.string().required("Phone number is required"),
      dateOfBirth: Yup.string().required("Date of Birth is required"),
      companyName: Yup.string().required("Company name is required"),
      companyType: Yup.string().required("Company type is required"),
      panNumber: Yup.string().required("PAN number is required"),
      gstNumber: Yup.string().required("GST number is required"),
      headOfficeAddress: Yup.string().required("Head Office Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      country: Yup.string().required("Country is required"),
      pinCode: Yup.string().required("Pincode is required"),
    }),
    onSubmit: async (values) => {
      if (!adminId) {
        alert("Admin not logged in!");
        return;
      }
 
      const payload = { ...values, admin: { id: parseInt(adminId, 10) } };
 
      try {
        if (mode === "edit" && profileId) {
          // Update existing profile
          await updateAdminProfile(profileId, payload);
          alert("Profile Updated Successfully!");
        } else {
          // Create new profile
          const res = await saveAdminProfile(payload);
          if (res.id) {
            // Track profile ID per admin in sessionStorage
            sessionStorage.setItem(profileKey, res.id);
            setProfileId(res.id);
          }
          alert("Profile Created Successfully!");
        }
        fetchProfile(); // refresh profile data
      } catch (err) {
        console.error("Error saving profile:", err);
        alert("Failed to save profile.");
      }
    },
  });
 
  // Fetch profile for current admin
  const fetchProfile = async () => {
    if (!adminId) {
      setMode("create");
      return;
    }
 
    // Check sessionStorage for profileId first
    let storedProfileId = sessionStorage.getItem(profileKey);
 
    if (!storedProfileId) {
      setMode("create");
      return;
    }
 
    try {
      const data = await getAdminProfile(storedProfileId);
      if (data) {
        setProfileId(data.id);
        formik.setValues({
          name: data.name || "",
          email: data.email || "",
          password: data.password || "",
          phoneNumber: data.phoneNumber || "",
          dateOfBirth: data.dateOfBirth || "",
          companyName: data.companyName || "",
          companyType: data.companyType || "",
          panNumber: data.panNumber || "",
          gstNumber: data.gstNumber || "",
          headOfficeAddress: data.headOfficeAddress || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          pinCode: data.pinCode || "",
        });
        setMode("view");
      } else {
        setMode("create");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setMode("create");
    }
  };
 
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminId]);
 
  // Loading state
  if (mode === "loading") return <p>Loading...</p>;
 
  // View mode
  if (mode === "view") {
    const values = formik.values;
    return (
      <div className="form-container">
        <h2>Admin Profile</h2>
        <div className="profile-view">
          {Object.keys(formik.initialValues).map((field) => (
            <div key={field} className="profile-row">
              <strong>{field.replace(/([A-Z])/g, " $1")}:</strong>{" "}
              <span>{values[field]}</span>
            </div>
          ))}
          <div className="profile-actions">
            <button onClick={() => setMode("edit")} className="edit-btn">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    );
  }
 
  // Create/Edit form
  return (
    <div className="form-container">
      <h2>{mode === "edit" ? "Edit Admin Profile" : "Create Admin Profile"}</h2>
      <form onSubmit={formik.handleSubmit} className="form-grid">
        {Object.keys(formik.initialValues).map((field) => (
          <div key={field} className="form-group">
            <label>{field.replace(/([A-Z])/g, " $1")}</label>
            <input
              type={
                field === "password"
                  ? "password"
                  : field === "dateOfBirth"
                  ? "date"
                  : "text"
              }
              {...formik.getFieldProps(field)}
            />
            {formik.touched[field] && formik.errors[field] && (
              <p className="error">{formik.errors[field]}</p>
            )}
          </div>
        ))}
        <div className="form-group full-width">
          <button type="submit" className="submit-btn">
            {mode === "edit" ? "Update Profile" : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}