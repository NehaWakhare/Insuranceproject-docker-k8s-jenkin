import './HealthPlans.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import individualImg from '../assets/individual.png';
import familyImg from '../assets/family.png';
import seniorImg from '../assets/senior.png';
import criticalImg from '../assets/critical.png';
import defaultImg from '../assets/default.png'; 

export default function HealthPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    if (!authData || !authData.token) {
      alert("Please login.");
      navigate("/auth", { state: { redirectAfterLogin: "/available-policies" } });
      return;
    }

    const token = authData.token;

    axios.get("http://localhost:8089/admin/policy-plans/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setPlans(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching health plans:", err);
      setLoading(false);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleViewPlan = (plan) => {
    const planId = plan.id || plan.planId || plan.policyId;
    if (!planId) {
      alert("Policy ID not found!");
      return;
    }
    navigate(`/available-policies/${planId}`);
  };

  const getPlanImage = (policyType = "") => {
    const key = policyType.toLowerCase();
    if (key.includes("family")) return familyImg;
    if (key.includes("senior")) return seniorImg;
    if (key.includes("child")) return criticalImg;
    if (key.includes("individual")) return individualImg;
    return defaultImg; 
  };

  if (loading) return <p>Loading health plans...</p>;

  return (
    <section className="insurance-categories">
      <h2>Explore Our Health Insurance Plans</h2>
      <div className="categories-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="category-tile">
            <img
              src={getPlanImage(plan.policyType)}
              alt={plan.policyName}
              className="category-img"
            />
            <h3>{plan.policyName}</h3>
            <div className="btn-container">
              <button
                className="category-link"
                onClick={() => handleViewPlan(plan)}
              >
                View Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
