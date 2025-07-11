import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPolicies.css';
import { useLocation, Link } from 'react-router-dom';

import individualImg from '../assets/individual.png';
import familyImg from '../assets/family.png';
import seniorImg from '../assets/senior.png';
import criticalImg from '../assets/critical.png';
import defaultImg from '../assets/default.png';

export default function MyPolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const success = location.state?.success;
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedId = sessionStorage.getItem("userId");
    if (storedId) {
      setUserId(storedId);
    } else {
      alert("Please log in to view your policies.");
    }
  }, []);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      axios.get(`http://localhost:8089/user/get-policies/${userId}`) 
        .then(res => setPolicies(res.data))
        .catch(err => console.error("Error fetching policies", err))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  const getPlanImage = (name = "") => {
    const key = name.toLowerCase();
    if (key.includes("family")) return familyImg;
    if (key.includes("senior")) return seniorImg;
    if (key.includes("critical")) return criticalImg;
    if (key.includes("individual")) return individualImg;
    return defaultImg;
  };

  return (
    <div className="policies-container">
      <h2 className="heading">My Insurance Policies</h2>

      {success && (
        <p className="success-message">✅ Policy purchased successfully!</p>
      )}

      {loading ? (
        <p>Loading your policies...</p>
      ) : policies.length === 0 ? (
        <div className="no-policies">
          <p className="empty-message">You don’t have any policies yet.</p>
          <Link to="/health-plans" className="browse-link">Browse Available Policies</Link>
        </div>
      ) : (
        <div className="policy-grid">
          {policies.map(policy => (
            <div key={policy.id} className={`policy-card ${policy.policyStatus.toLowerCase()}`}>
              <img
                src={getPlanImage(policy.policyPlan.planName)}
                alt={policy.policyPlan.planName}
                className="policy-img"
              />
              <div className="policy-info">
                <h3 className="policy-name">{policy.policyPlan.planName}</h3>
                <p><strong>Status:</strong> <span className="status">{policy.policyStatus}</span></p>
                <p><strong>Coverage:</strong> ₹{policy.policyPlan.coverageAmount}</p>
                <p><strong>Premium:</strong> ₹{policy.policyPlan.premium}</p>
                <p><strong>Start Date:</strong> {policy.startDate}</p>
                <p><strong>End Date:</strong> {policy.endDate}</p>
                <p><strong>Nominee:</strong> {policy.nominee} ({policy.nomineeRelation})</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
