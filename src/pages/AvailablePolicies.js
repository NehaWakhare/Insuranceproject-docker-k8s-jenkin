import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './AvailablePolicies.css';

import individualImg from '../assets/individual.png';
import familyImg from '../assets/family.png';
import seniorImg from '../assets/senior.png';
import criticalImg from '../assets/critical.png';
import defaultImg from '../assets/default.png';

export default function AvailablePolicies() {
  const [policy, setPolicy] = useState(null);
  const [nominee, setNominee] = useState('');
  const [relation, setRelation] = useState('');
  const [userId, setUserId] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const getPlanImage = (name = "") => {
    const key = name.toLowerCase();
    if (key.includes("family")) return familyImg;
    if (key.includes("senior")) return seniorImg;
    if (key.includes("critical")) return criticalImg;
    if (key.includes("individual")) return individualImg;

    return defaultImg; // common image for other/new plans
  };

  useEffect(() => {
    const storedId = sessionStorage.getItem("userId");
    if (!storedId) {
      alert("Please login to buy a policy.");
      navigate("/login");
    } else {
      setUserId(storedId);
    }

    axios.get("http://localhost:8089/user/fetch-plan")
      .then((res) => {
        const match = res.data.find(p => p.policyId.toString() === id);
        if (match) {
          setPolicy(match);
        } else {
          alert("Policy not found");
        }
      })
      .catch((err) => {
        console.error("Error fetching policy:", err);
        alert("Something went wrong");
      });
  }, [id, navigate]);

  const handleSubmit = async () => {
    if (!nominee || !relation) {
      alert("Please fill nominee details");
      return;
    }

    const payload = {
      userId: Number(userId),
      policyId: policy.policyId,
      nominee,
      nomineeRelation: relation
    };

    try {
      await axios.post("http://localhost:8089/user/add-policy", payload);
      navigate("/my-policies", { state: { success: true } });
    } catch (err) {
      console.error("Error buying policy:", err);
      alert("Failed to buy policy");
    }
  };

  if (!userId || !policy) return null;

 return (
  <div className="policy-container">
    {/* Image Column */}
    <div className="image-column">
      <img src={getPlanImage(policy.policyName)} alt={policy.policyName} className="policy-img" />
    </div>

    {/* Content Row: Policy Info + Nominee Form */}
    <div className="details-column">
      <div className="policy-info">
        <h2>{policy.policyName}</h2>
        <p className="description">{policy.description}</p>
        <p>Coverage: {policy.coverage}</p>
        <p>Premium: ₹{policy.premium}</p>
        <p>Duration: {policy.duration} years</p>
      </div>

      <div className="nominee-form">
        <h3>Nominee Details</h3>
        <input
          type="text"
          placeholder="Nominee Name"
          value={nominee}
          onChange={(e) => setNominee(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nominee Relation"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
        />
        <button className="submit-btn" onClick={handleSubmit}>Buy Policy</button>
      </div>
    </div>
  </div>
);

}