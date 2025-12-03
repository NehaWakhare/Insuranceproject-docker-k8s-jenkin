import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CONFIG from "../../../config/config";
import "./AvailablePolicies.css";

const AvailablePolicies = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [showNomineeForm, setShowNomineeForm] = useState(false);

  // New Fields
  const [nominee, setNominee] = useState("");
  const [nomineeRelation, setNomineeRelation] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState({});

  const [successMessage, setSuccessMessage] = useState("");

  const BASE_URL = CONFIG.BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/admin-policy/policy-plans/all`)
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

  // ⭐ VALIDATION
  const validateForm = () => {
    const newErrors = {};

    if (!nominee.trim()) newErrors.nominee = "Nominee name is required";
    if (!nomineeRelation.trim()) newErrors.nomineeRelation = "Relation is required";
    if (!gender) newErrors.gender = "Select gender";
    if (!dob) newErrors.dob = "DOB is required";

    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      newErrors.aadhaarNumber = "Aadhaar must be 12 digits";
    }

    if (!age || age <= 0) newErrors.age = "Enter a valid age";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePurchase = () => {
    if (!validateForm()) return;

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
      gender,
      dob,
      aadhaarNumber,
      age,
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

      {/* Apply blur when form is open */}
      <div className={`policy-detail-card ${showNomineeForm ? "blur-bg" : ""}`}>
        <button className="close-btn" onClick={handleClose}>✖</button>

        <div className="policy-detail-content">
          <div className="policy-detail-image">
            <img
              src={`${BASE_URL}/admin-policy/policy-plans/view-image/${policy.id}`}
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
                <button className="buy-btn" onClick={handleBuyNow}>Buy Now</button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* ⭐ Nominee Popup Form */}
      {showNomineeForm && (
        <div className="nominee-popup">
          <div className="nominee-box">
            <button className="popup-close" onClick={handleBack}>✖</button>

            <h3>Enter Nominee Details</h3>

            <input
              type="text"
              placeholder="Nominee Name"
              value={nominee}
              onChange={(e) => setNominee(e.target.value)}
            />
            {errors.nominee && <p className="error">{errors.nominee}</p>}

            <input
              type="text"
              placeholder="Nominee Relation"
              value={nomineeRelation}
              onChange={(e) => setNomineeRelation(e.target.value)}
            />
            {errors.nomineeRelation && <p className="error">{errors.nomineeRelation}</p>}

            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="error">{errors.gender}</p>}

            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            {errors.dob && <p className="error">{errors.dob}</p>}

            <input
              type="number"
              placeholder="Aadhaar Number (12 digits)"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
            />
            {errors.aadhaarNumber && <p className="error">{errors.aadhaarNumber}</p>}

            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            {errors.age && <p className="error">{errors.age}</p>}

            <button className="purchase-btn" onClick={handlePurchase}>
              Confirm Purchase
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailablePolicies;
