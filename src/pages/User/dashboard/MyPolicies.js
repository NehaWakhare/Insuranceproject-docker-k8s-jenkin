import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPolicies.css';
import { Link } from 'react-router-dom';
import CONFIG from "../../../config/config";

const BASE_URL = CONFIG.BASE_URL;

export default function MyPolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = JSON.parse(sessionStorage.getItem('authData'));
      if (!storedUser) {
        alert('Please login to view your policies.');
        setLoading(false);
        return;
      }

      const userId = storedUser.userId;
      const token = storedUser.token;

      try {
        setLoading(true);

        // Fetch purchased policies
        const purchasedRes = await axios.get(
          `${BASE_URL}/user-policy/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const purchasedPolicies = purchasedRes.data;

        // Fetch all policy plans
        const plansRes = await axios.get(
          `${BASE_URL}/admin/policy-plans/all`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const allPlans = plansRes.data;

        // Merge purchased policies with plan details
        const merged = purchasedPolicies.map(up => {
          const plan = allPlans.find(p => p.id === up.policyId);
          return { ...up, plan, showInfo: false };
        });

        setPolicies(merged);
      } catch (err) {
        console.error('Error fetching policies:', err);
        alert('Failed to fetch policies.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading your policies...</p>;

  if (policies.length === 0)
    return (
      <div className="no-policies">
        <p className="empty-message">You don’t have any purchased policies yet.</p>
        <Link to="/health-plans" className="browse-link">
          Browse Available Policies
        </Link>
      </div>
    );

  const toggleInfo = (id) => {
    setPolicies(prev =>
      prev.map(p => p.id === id ? { ...p, showInfo: !p.showInfo } : p)
    );
  };

  return (
    <div className="policies-container">
      <h2 className="heading">My Purchased Policies</h2>
      <div className="policy-grid">
        {policies.map(policy => (
          <div key={policy.id} className={`policy-card ${policy.status.toLowerCase()}`}>
            <h3 className="policy-name">{policy.plan?.policyName || 'Unknown Plan'}</h3>
            <div
              className="image-wrapper"
              onMouseEnter={() => toggleInfo(policy.id)}
              onMouseLeave={() => toggleInfo(policy.id)}
            >
              <img
                src={
                  policy.plan?.imageUrl
                    ? `${BASE_URL}/admin/policy-plans/view-image/${policy.plan.id}`
                    : ''
                }
                alt={policy.plan?.policyName}
                className="policy-img"
              />
            </div>
            {policy.showInfo && (
              <div className="policy-info">
                <p><strong>Status:</strong> {policy.status}</p>
                <p><strong>Coverage:</strong> ₹{policy.plan?.coverage}</p>
                <p><strong>Premium:</strong> ₹{policy.plan?.premium}</p>
                <p><strong>Duration:</strong> {policy.plan?.durationInYears} years</p>
                <p><strong>Start Date:</strong> {policy.startDate}</p>
                <p><strong>End Date:</strong> {policy.endDate}</p>
                {policy.nominee && (
                  <p>
                    <strong>Nominee:</strong> {policy.nominee} ({policy.nomineeRelation})
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
