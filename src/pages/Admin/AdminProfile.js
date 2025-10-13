import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../pages/Admin/AdminProfile.css";
import {
  saveAdminProfile,
  getAdminProfile,
  updateAdminProfile,
} from "../AdminAPI/AdminProfileAPI";

export default function AdminProfileForm() {
  const [mode, setMode] = useState("loading"); // "loading", "create", "view", "edit"
  const [profileId, setProfileId] = useState(null);
  const adminId = sessionStorage.getItem("adminId");
  const profileKey = `profileId_${adminId}`;

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
      correspondenceAddress: "",
      permanentAddress: "",
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
      correspondenceAddress: Yup.string().required("Correspondence Address is required"),
      permanentAddress: Yup.string().required("Permanent Address is required"),
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
          await updateAdminProfile(profileId, payload);
          alert("Profile Updated Successfully!");
        } else {
          const res = await saveAdminProfile(payload);
          if (res.id) {
            sessionStorage.setItem(profileKey, res.id);
            setProfileId(res.id);
          }
          alert("Profile Created Successfully!");
        }
        fetchProfile();
      } catch (err) {
        console.error("Error saving profile:", err);
        alert("Failed to save profile.");
      }
    },
  });

  // Fetch Profile
  const fetchProfile = async () => {
    if (!adminId) {
      setMode("create");
      return;
    }

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
          correspondenceAddress: data.correspondenceAddress || "",
          permanentAddress: data.permanentAddress || "",
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

  // Loading State
  if (mode === "loading") return <p>Loading...</p>;

  // View Mode - TABLE FORMAT
  if (mode === "view") {
    const values = formik.values;
    return (
      <div className="form-container">
        <h2>Admin Profile</h2>
        <table className="profile-table">
          <tbody>
            {Object.keys(formik.initialValues).map((field) => (
              <tr key={field}>
                <td className="field-name">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                </td>
                <td className="field-value">{values[field]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="profile-actions">
          <button onClick={() => setMode("edit")} className="edit-btn blue-btn">
            Edit Profile
          </button>
        </div>
      </div>
    );
  }

  // Create/Edit Form
  return (
    <div className="form-container">
      <h2>{mode === "edit" ? "Edit Admin Profile" : "Create Admin Profile"}</h2>
      <form onSubmit={formik.handleSubmit} className="form-grid">
        {Object.keys(formik.initialValues).map((field) => (
          <div key={field} className="form-group">
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
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
