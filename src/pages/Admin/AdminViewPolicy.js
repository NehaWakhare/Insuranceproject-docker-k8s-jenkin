import React, { useEffect, useState } from "react";
import { getPlansByAdmin } from "../AdminAPI/AdminPolicyPlanAPI.js";
import "../Admin/AdminPolicy.css";

export default function AdminViewPolicy() {
  const [plans, setPlans] = useState([]);
  const adminId = sessionStorage.getItem("adminId"); // auto from session

  const fetchPlans = async () => {
    if (!adminId) return;
    try {
      const res = await getPlansByAdmin(adminId);
      setPlans(res.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setPlans([]);
    }
  };

  useEffect(() => {
    fetchPlans(); // initial fetch
    // 🔹 Listen for add-policy event
    window.addEventListener("policyAdded", fetchPlans);
    return () => window.removeEventListener("policyAdded", fetchPlans);
  }, [adminId]);

  return (
    <div className="list-container">
      <h2 className="form-title">📋 Your Policy Plans</h2>
      {plans.length > 0 ? (
        <table className="policy-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Policy Name</th>
              <th>Policy Type</th>
              <th>Coverage</th>
              <th>Premium</th>
              <th>Duration (Years)</th>
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
