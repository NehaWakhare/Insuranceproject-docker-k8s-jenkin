import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPolicies.css';
import { Link } from 'react-router-dom';
import CONFIG from "../../../config/config";

const BASE_URL = CONFIG.BASE_URL;

export default function MyPolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null); 

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

        // Fetch purchased policies (might already include plan details if backend merged)
        const purchasedRes = await axios.get(
          `${BASE_URL}/user-policy/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        let purchasedPolicies = purchasedRes.data || [];

        // If backend returns each purchased policy already containing full plan data (e.g. property 'plan'),
        // we can use it directly. Otherwise fetch all plans and merge.
        const needsPlanMerge = purchasedPolicies.some(item => !item.plan && !!item.policyId);

        if (needsPlanMerge) {
          // Fetch all policy plans once and merge
          const plansRes = await axios.get(
            `${BASE_URL}/admin-policy/policy-plans/all`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const allPlans = plansRes.data || [];

          purchasedPolicies = purchasedPolicies.map(up => {
            const plan = allPlans.find(p => p.id === up.policyId) || null;
            return { ...up, plan };
          });
        } else {
          // If items already include plan but the plan field name differs (some backends might embed fields directly),
          // we try to normalize: ensure each item has a `plan` object (if plan-specific fields exist at root).
          purchasedPolicies = purchasedPolicies.map(up => {
            if (!up.plan) {
              // Try to detect plan-like fields at root and assemble a plan object
              const hasPlanFields =
                up.policyName || up.coverage || up.premium || up.durationInYears || up.imageUrl;
              if (hasPlanFields) {
                const plan = {
                  id: up.policyId ?? up.id ?? null,
                  policyName: up.policyName,
                  coverage: up.coverage,
                  premium: up.premium,
                  durationInYears: up.durationInYears ?? up.duration,
                  imageUrl: up.imageUrl,
                  // keep any other plan-related fields if present
                };
                return { ...up, plan };
              }
            }
            return up;
          });
        }

        setPolicies(purchasedPolicies);
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

  if (!policies || policies.length === 0)
    return (
      <div className="no-policies">
        <p className="empty-message">You don’t have any purchased policies yet.</p>
        <Link to="/health-plans" className="browse-link">
          Browse Available Policies
        </Link>
      </div>
    );

  // safe getter helpers to avoid undefined errors
  const safe = (v, fallback = '') => (v === null || v === undefined ? fallback : v);
  const safeLower = (v) => String(safe(v)).toLowerCase();

  return (
    <div className="policies-container">
      <h2 className="heading">My Purchased Policies</h2>

      <div className="policy-grid">
        {policies.map((policy) => {
          if (!policy) return null;

          // compute a safe css status (so .toLowerCase() never throws)
          const cardStatus = safeLower(policy.status || policy.plan?.status || 'unknown');

          return (
            <div
              key={policy.id ?? policy.policyId ?? Math.random()}
              className={`policy-card ${cardStatus}`}
              onClick={() => setSelectedPolicy(policy)} // show details below
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedPolicy(policy); }}
            >
              <h3 className="policy-name">{policy.plan?.policyName || policy.policyName || 'Unknown Plan'}</h3>

              <div className="image-wrapper">
                <img
                  src={
                    policy.plan?.imageUrl
                      ? `${BASE_URL}/admin-policy/policy-plans/view-image/${policy.plan.id}`
                      : (policy.imageUrl ? policy.imageUrl : '')
                  }
                  alt={policy.plan?.policyName || policy.policyName || 'Policy Image'}
                  className="policy-img"
                />
              </div>

              {/* keep existing hover info logic untouched (uses policy.showInfo if present) */}
              {policy.showInfo && (
                <div className="policy-info">
                  <p><strong>Status:</strong> {safe(policy.status)}</p>
                  <p><strong>Coverage:</strong> ₹{safe(policy.plan?.coverage ?? policy.coverage ?? '')}</p>
                  <p><strong>Premium:</strong> ₹{safe(policy.plan?.premium ?? policy.premium ?? '')}</p>
                  <p><strong>Duration:</strong> {safe(policy.plan?.durationInYears ?? policy.duration ?? '')} years</p>
                  <p><strong>Start Date:</strong> {safe(policy.startDate)}</p>
                  <p><strong>End Date:</strong> {safe(policy.endDate)}</p>
                  {policy.nominee && (
                    <p>
                      <strong>Nominee:</strong> {policy.nominee} ({policy.nomineeRelation})
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DETAILS PANEL (shown on same page when a policy is clicked) */}
      {selectedPolicy && (
        <div className="policy-detail-panel">
          <h3>Policy Details</h3>

          <div className="detail-row">
            <strong>Name:</strong> {selectedPolicy.plan?.policyName || selectedPolicy.policyName || '—'}
          </div>

          <div className="detail-row">
            <strong>Status:</strong> {safe(selectedPolicy.status)}
          </div>

          <div className="detail-row">
            <strong>Coverage:</strong> ₹{safe(selectedPolicy.plan?.coverage ?? selectedPolicy.coverage ?? '—')}
          </div>

          <div className="detail-row">
            <strong>Premium:</strong> ₹{safe(selectedPolicy.plan?.premium ?? selectedPolicy.premium ?? '—')}
          </div>

          <div className="detail-row">
            <strong>Duration:</strong> {safe(selectedPolicy.plan?.durationInYears ?? selectedPolicy.duration ?? '—')} years
          </div>

          <div className="detail-row">
            <strong>Start Date:</strong> {safe(selectedPolicy.startDate ?? '—')}
          </div>

          <div className="detail-row">
            <strong>End Date:</strong> {safe(selectedPolicy.endDate ?? '—')}
          </div>

          {selectedPolicy.nominee && (
            <div className="detail-row">
              <strong>Nominee:</strong> {selectedPolicy.nominee} ({selectedPolicy.nomineeRelation})
            </div>
          )}

          {/* Dump full object for debug / full response view */}
          <div className="detail-raw">
            <h4>Full Response</h4>
            <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 300, overflow: 'auto' }}>
              {JSON.stringify(selectedPolicy, null, 2)}
            </pre>
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={() => setSelectedPolicy(null)}>Close Details</button>
          </div>
        </div>
      )}
    </div>
  );
}
