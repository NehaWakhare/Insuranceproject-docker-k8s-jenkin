import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createPolicyPlan } from "../AdminAPI/AdminPolicyPlanAPI.js";
import "../Admin/AdminPolicy.css";

export default function AdminAddPolicy() {
  const adminId = sessionStorage.getItem("adminId"); // get logged-in admin ID

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
      coverage: Yup.number().typeError("Must be a number").required("Coverage is required"),
      premium: Yup.number().typeError("Must be a number").required("Premium is required"),
      durationInYears: Yup.number().typeError("Must be a number").required("Duration is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await createPolicyPlan(adminId, values);
        alert("✅ Policy Plan Added Successfully!");
        resetForm();

        // 🔹 Trigger event so AdminViewPolicy refreshes automatically
        window.dispatchEvent(new Event("policyAdded"));
      } catch (err) {
        console.error("Error:", err);
        alert("❌ Failed to add policy plan");
      }
    },
  });

  return (
    <div className="form-container">
      <h2 className="form-title">➕ Add Policy Plan</h2>
      <form onSubmit={formik.handleSubmit} className="form-grid">
        {Object.keys(formik.initialValues).map((field) => (
          <div key={field} className="form-group">
            <label>{field.replace(/([A-Z])/g, " $1")}</label>
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
        <div className="form-group full-width">
          <button type="submit" className="submit-btn">Save Policy</button>
        </div>
      </form>
    </div>
  );
}
