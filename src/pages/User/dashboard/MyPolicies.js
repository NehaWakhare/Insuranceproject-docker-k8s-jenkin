import React, { useEffect, useState } from "react";
import CONFIG from "../../../config/config";
import "./MyPolicies.css";


const MyPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null); 
  const BASE_URL = CONFIG.BASE_URL;

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const authData = JSON.parse(sessionStorage.getItem("authData"));
        const userId = authData?.userId;
        if (!userId) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        
        const res = await fetch(`${BASE_URL}/user-policy/user/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch policies");
        const data = await res.json();
       
        const arr = Array.isArray(data) ? data : data ? [data] : [];
        setPolicies(arr);
      } catch (err) {
        console.error("Error fetching policies:", err);
        setError("Failed to load policies. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchPolicies();
   
  }, []); 

  const openPolicyModal = (policy) => {
    setSelectedPolicy(policy);
    
    document.body.style.overflow = "hidden";
  };

  const closePolicyModal = () => {
    setSelectedPolicy(null);
    document.body.style.overflow = "";
  };

  const getImageSrc = (policy) => {
    
    if (policy.imageURL && typeof policy.imageURL === "string") {
      const lower = policy.imageURL.toLowerCase();
      if (lower.startsWith("http") || lower.startsWith("https")) {
        return policy.imageURL;
      }
     
      if (policy.policyId) {
        return `${BASE_URL}/admin-policy/policy-plans/view-image/${policy.policyId}`;
      }
    }
   
    return `${BASE_URL}/static/images/policy-placeholder.png`; };

  return (
    <div className="my-policies-page">
      <h2 className="page-title">My Policies</h2>

      {loading ? (
        <div className="loading">Loading policies...</div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : policies.length === 0 ? (
        <div className="empty">You don't have any purchased policies yet.</div>
      ) : (
        <>
          <div className={`policies-grid ${selectedPolicy ? "blur-bg" : ""}`}>
            {policies.map((p) => (
              <div
                className="policy-card"
                key={p.id ?? p.policyId}
                onClick={() => openPolicyModal(p)}
                role="button"
                tabIndex={0}
              >
                <div className="card-image">
                  <img src={getImageSrc(p)} alt={p.policyName} onError={(e) => (e.target.src = `${BASE_URL}/static/images/policy-placeholder.png`)} />
                </div>

                <div className="card-body">
                  <h4 className="card-title">{p.policyName}</h4>
                  <div className={`status-badge ${p.policyStatus?.toLowerCase()}`}>
                    {p.policyStatus || "UNKNOWN"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {selectedPolicy && (
            <div className="policy-modal-backdrop" onClick={closePolicyModal}>
              <div
                className="policy-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
              >
                

                <div className="policy-modal-content">
                  <div className="policy-modal-image">
                    <img src={getImageSrc(selectedPolicy)} alt={selectedPolicy.policyName} onError={(e) => (e.target.style.display = "none")} />
                  </div>

                  <div className="policy-modal-info">
                    <h2>{selectedPolicy.policyName}</h2>
                    <p className="muted"><strong>Type:</strong> {selectedPolicy.policyType}</p>
                    <p><strong>Coverage:</strong> ₹{selectedPolicy.coverage}</p>
                    <p><strong>Premium:</strong> ₹{selectedPolicy.premium}</p>
                    <p><strong>Duration:</strong> {selectedPolicy.durationInYears} years</p>
                    {selectedPolicy.startDate && selectedPolicy.endDate && (
                      <p><strong>Period:</strong> {selectedPolicy.startDate} — {selectedPolicy.endDate}</p>
                    )}
                    <hr />

                    <h3>Nominee Details</h3>
                    <p><strong>Name:</strong> {selectedPolicy.nominee}</p>
                    <p><strong>Relation:</strong> {selectedPolicy.nomineeRelation}</p>
                    <p><strong>Gender:</strong> {selectedPolicy.gender}</p>
                    <p><strong>DOB:</strong> {selectedPolicy.dob}</p>
                    <p><strong>Aadhaar:</strong> {selectedPolicy.aadhaarNumber}</p>
                    <p><strong>Age:</strong> {selectedPolicy.age}</p>

                    <div style={{ marginTop: 12 }}>
                      <button className="modal-action-btn" onClick={closePolicyModal}>Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyPolicies;
