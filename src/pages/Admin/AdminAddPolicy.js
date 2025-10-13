import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createPolicyPlan, updatePolicyPlan } from "../AdminAPI/AdminPolicyPlanAPI.js";
import "../Admin/AdminPolicy.css";

const capitalizeLabel = (text) =>
  text.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();

export default function AdminAddPolicy() {
  const adminId = sessionStorage.getItem("adminId");
  const [file, setFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  
  useEffect(() => {
    const storedPolicy = sessionStorage.getItem("editPolicy");
    if (storedPolicy) {
      const policy = JSON.parse(storedPolicy);
      formik.setValues({
        policyName: policy.policyName || "",
        policyType: policy.policyType || "",
        coverage: policy.coverage || "",
        premium: policy.premium || "",
        durationInYears: policy.durationInYears || "",
      });
      setEditId(policy.id);
      setEditMode(true);
      sessionStorage.removeItem("editPolicy");
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      policyName: "",
      policyType: "",
      coverage: "",
      premium: "",
      durationInYears: "",
    },
    validationSchema: Yup.object({
      policyName: Yup.string().required("Policy Name is required"),
      policyType: Yup.string().required("Policy Type is required"),
      coverage: Yup.number().required("Coverage is required"),
      premium: Yup.number().required("Premium is required"),
      durationInYears: Yup.number().required("Duration is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("policy", JSON.stringify(values));
        if (file) formData.append("image", file);

        if (editMode) {
          
          await updatePolicyPlan(adminId, editId, formData);
          alert("Policy Updated Successfully!");
        } else {
          
          await createPolicyPlan(adminId, formData);
          alert("Policy Added Successfully!");
        }

        resetForm();
        setFile(null);
        setEditMode(false);
        setEditId(null);

        // Notify other components (like view page)
        window.dispatchEvent(new Event("policyAdded"));

        // Redirect to view page after update
        window.location.href = "/admin/dashboard/view-policies";
      } catch (err) {
        console.error("Error:", err);
        alert("❌ Failed to save policy plan");
      }
    },
  });

  return (
    <div className="form-container">
      <h2 className="form-title">
        {editMode ? "✏️ Edit Policy Plan" : "➕ Add Policy Plan"}
      </h2>
      <form onSubmit={formik.handleSubmit} className="form-grid" encType="multipart/form-data">
        {Object.keys(formik.initialValues).map((field) => (
          <div key={field} className="form-group">
            <label>{capitalizeLabel(field)}</label>
            <input
              type={field === "policyName" || field === "policyType" ? "text" : "number"}
              {...formik.getFieldProps(field)}
              className={formik.errors[field] && formik.touched[field] ? "error-input" : ""}
            />
            {formik.touched[field] && formik.errors[field] && (
              <p className="error">{formik.errors[field]}</p>
            )}
          </div>
        ))}

        {/* Image Upload */}
        <div className="form-group">
          <label>Policy Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="form-group full-width">
          <button type="submit" className="submit-btn">
            {editMode ? "Update Policy" : "Save Policy"}
          </button>
        </div>
      </form>
    </div>
  );
}
