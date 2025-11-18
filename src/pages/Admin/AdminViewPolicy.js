import React, { useEffect, useState, useCallback } from "react";
import { getPlansByAdmin, deletePolicyPlan } from "../AdminAPI/AdminPolicyPlanAPI.js";
import "../Admin/AdminPolicy.css";
import CONFIG from "../../config/config.js";

export default function AdminViewPolicy() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
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
      alert("Failed to delete policy");
    }
  }
};

  const handleEdit = (plan) => {
    sessionStorage.setItem("editPolicy", JSON.stringify(plan));
    window.location.href = "/admin/dashboard/add-policy";
  };

  const handleView = (plan) => setSelectedPlan(plan);
  const closeModal = () => setSelectedPlan(null);

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
              <th>Duration(Years)</th>
              <th>View Policy</th>
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
                  <button className="view-btn" onClick={() => handleView(plan)}>
                    View
                  </button>
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

      {/* ---------- VIEW MODAL WITH BLUR ---------- */}
      {selectedPlan && (
        <div className="policy-overlay" onClick={closeModal}>
          <div className="policy-modal" onClick={(e) => e.stopPropagation()}>
            {/* Close Button Top Right */}
            <button className="policy-close-btn" onClick={closeModal}>✖</button>

            <h2 className="policy-heading">{selectedPlan.policyName}</h2>

            {selectedPlan.imageUrl ? (
              <div className="policy-image-preview">
                <img
                  src={`${CONFIG.BASE_URL}/admin/policy-plans/view-image/${selectedPlan.id}`}
                  alt="Policy"
                />
              </div>
            ) : (
              <p className="no-image">No Image Available</p>
            )}

            <div className="policy-details">
              <p><strong>Policy
                             Type:</strong> {selectedPlan.policyType}</p>
              <p><strong>Coverage:</strong> ₹ {selectedPlan.coverage}</p>
              <p><strong>Premium :</strong> ₹ {selectedPlan.premium}</p>
              <p><strong>Duration 
                          (Years):</strong> {selectedPlan.durationInYears}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
