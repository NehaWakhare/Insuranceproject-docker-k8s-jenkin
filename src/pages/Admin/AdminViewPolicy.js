import React, { useEffect, useState, useCallback } from "react";
import { getPlansByAdmin, deletePolicyPlan } from "../AdminAPI/AdminPolicyPlanAPI.js";
import "../Admin/AdminPolicy.css";

export default function AdminViewPolicy() {
  const [plans, setPlans] = useState([]);
  const adminId = sessionStorage.getItem("adminId");

  const fetchPlans = useCallback(async () => {
    try {
      const res = await getPlansByAdmin(adminId);
      setPlans(res.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setPlans([]);
    }
  }, [adminId]);

  const handleDelete = async (planId) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await deletePolicyPlan(adminId, planId);
        fetchPlans();
      } catch (err) {
        console.error("Error deleting:", err);
        alert("❌ Failed to delete policy");
      }
    }
  };

  const handleEdit = (plan) => {
    sessionStorage.setItem("editPolicy", JSON.stringify(plan));
    window.location.href = "/admin/dashboard/add-policy";
  };

  useEffect(() => {
    fetchPlans();
    window.addEventListener("policyAdded", fetchPlans);
    return () => window.removeEventListener("policyAdded", fetchPlans);
  }, [fetchPlans]);

  return (
    <div className="list-container">
      <h2 className="form-title">📋 Your Policy Plans</h2>
      {plans.length > 0 ? (
        <table className="policy-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Policy Name</th>
              <th>Type</th>
              <th>Coverage</th>
              <th>Premium</th>
              <th>Duration</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td>{plan.id}</td>
                <td>{plan.policyName}</td>
                <td>{plan.policyType}</td>
                <td>₹ {plan.coverage}</td>
                <td>₹ {plan.premium}</td>
                <td>{plan.durationInYears}</td>
                <td>
                  {plan.imageUrl ? (
                    <a
                      href={`http://localhost:8089/admin/policy-plans/view-image/${plan.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <div className="action-btns">
                    <button className="edit-btn" onClick={() => handleEdit(plan)}>✏️ Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(plan.id)}>🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No policies found for your Admin ID</p>
      )}
    </div>
  );
}
