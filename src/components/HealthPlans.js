import "./HealthPlans.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CONFIG from "../config/config";

export default function HealthPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = `${CONFIG.BASE_URL}/admin/policy-plans`;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/all`)
      .then((res) => setPlans(res.data))
      .catch((err) => console.error("Error fetching health plans:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleViewPlan = (planId) => {
    const authData = JSON.parse(sessionStorage.getItem("authData") || "null");

    if (!authData?.userId) {
      alert("Please login to view policies.");
      navigate("/auth", {
        state: { redirectAfterLogin: `/available-policies/${planId}` },
      });
    } else {
      navigate(`/available-policies/${planId}`, { state: { fromHome: true } });
    }
  };

  const getImageUrl = (plan) => {
    return plan?.imageUrl
      ? `${BASE_URL}/view-image/${plan.id}`
      : null;
  };

  if (loading) return <p className="loading-text">Loading plans...</p>;

  return (
    <section className="insurance-categories" id="health-plans">
      <h2>Explore Our Health Insurance Plans</h2>
      <div className="categories-grid">
        {plans.length > 0 ? (
          plans.map((plan, index) => (
            <div key={plan.id} className="category-tile">
              {getImageUrl(plan) && (
                <img
                  src={getImageUrl(plan)}
                  alt={plan.policyName}
                  className="category-img"
                />
              )}
              <h3>
                {index + 1}. {plan.policyName}
              </h3>
              <button
                className="category-link"
                onClick={() => handleViewPlan(plan.id)}
              >
                View Plan
              </button>
            </div>
          ))
        ) : (
          <p>No plans available.</p>
        )}
      </div>
    </section>
  );
}
