import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CONFIG from "../config/config";
import "./AvailablePolicies.css";

const AvailablePolicies = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [showNomineeForm, setShowNomineeForm] = useState(false);
  const [nominee, setNominee] = useState("");
  const [nomineeRelation, setNomineeRelation] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const BASE_URL = CONFIG.BASE_URL; // ✅ base URL from config

  useEffect(() => {
    fetch(`${BASE_URL}/admin/policy-plans/all`) 
      .then((res) => res.json())
      .then((data) => {
        const selected = data.find((p) => p.id.toString() === id);
        setPolicy(selected || null);
      })
      .catch((err) => console.error("Error fetching policy:", err));
  }, [id]);

  const handleClose = () => {
    navigate("/health-plans");
  };

  const handleBack = () => {
    setShowNomineeForm(false);
  };

  const handleBuyNow = () => {
    setShowNomineeForm(true);
  };

  const handlePurchase = () => {
    const authData = JSON.parse(sessionStorage.getItem("authData"));
    const userId = authData?.userId;

    if (!userId) {
      console.error("User ID not found in sessionStorage!");
      return;
    }

    const purchaseData = {
      userId,
      policyId: policy.id,
      nominee,
      nomineeRelation,
    };

    fetch(`${BASE_URL}/user-policy/purchase`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(purchaseData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Purchase failed");
        return res.json();
      })
      .then(() => {
        setSuccessMessage("✅ Successfully purchased! Waiting for admin approval.");
        setTimeout(() => {
          navigate("/dashboard/policies");
        }, 1500);
      })
      .catch((err) => {
        console.error("Purchase error:", err);
        setSuccessMessage("❌ Failed to purchase policy. Try again later.");
      });
  };

  if (!policy) return <div className="loading">Loading policy...</div>;

  return (
    <div className="available-policies-container">
      {successMessage && <div className="success-banner">{successMessage}</div>}

      <div className="policy-detail-card">
        <button className="close-btn" onClick={handleClose}>✖</button>

        <div className="policy-detail-content">
          <div className="policy-detail-image">
            <img
              src={`${BASE_URL}/admin/policy-plans/view-image/${policy.id}`} 
              alt={policy.policyName}
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>

          <div className="policy-detail-text">
            <h2>{policy.policyName}</h2>
            <p><strong>Type:</strong> {policy.policyType}</p>
            <p><strong>Coverage:</strong> ₹{policy.coverage}</p>
            <p><strong>Premium:</strong> ₹{policy.premium}</p>
            <p><strong>Duration(years):</strong> {policy.durationInYears}</p>

            {!showNomineeForm ? (
              <div className="policy-description-section">
                <p className="description">{policy.description}</p>
                <button className="buy-btn" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>
            ) : (
              <div className="nominee-form">
                <h3>Enter Nominee Details</h3>
                <input
                  type="text"
                  placeholder="Nominee Name"
                  value={nominee}
                  onChange={(e) => setNominee(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Nominee Relation"
                  value={nomineeRelation}
                  onChange={(e) => setNomineeRelation(e.target.value)}
                />
                <div className="form-buttons">
                  <button className="back-btn" onClick={handleBack}>
                    Back
                  </button>
                  <button className="purchase-btn" onClick={handlePurchase}>
                    Confirm Purchase
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailablePolicies;
