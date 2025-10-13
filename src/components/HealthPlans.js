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

  useEffect(() => {
    axios.get('http://localhost:8089/admin/policy-plans/all')  
      .then((res) => setPlans(res.data))
      .catch((err) => console.error("Error fetching health plans:", err));
  }, []);

  const handleViewPlan = (policyId) => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("Please login to view policies.");
      navigate("/auth", { state: { redirectAfterLogin: `/available-policies/${policyId}` } });
    } else {
      navigate(`/available-policies/${policyId}`);
    }
  };

  const getPlanImage = (name = "") => {
    const key = name.toLowerCase();
    if (key.includes("family")) return familyImg;
    if (key.includes("senior")) return seniorImg;
    if (key.includes("critical")) return criticalImg;
    if (key.includes("individual")) return individualImg;
    return defaultImg; 
  };

  return (
    <section className="insurance-categories">
      <h2>Explore Our Health Insurance Plans</h2>
      <div className="categories-grid">
        {plans.map((plan) => (
          <div key={plan.policyId} className="category-tile">
            <img
              src={getPlanImage(plan.planName)}
              alt={plan.planName}
              className="category-img"
            />
            <h3>{plan.planName}</h3>
            <button
              className="category-link"
              onClick={() => handleViewPlan(plan.policyId)}
            >
              View Plan
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
