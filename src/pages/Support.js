import React from "react";
import { Link } from "react-router-dom";
import "./Support.css";
import Footer from "../components/Footer";

export default function Support() {
  return (
     <div className="page-with-footer">
    <div className="support-page">
      <h2>24×7 Customer Support</h2>
      <p>Call us at: <strong>1800-123-4567</strong></p>
      <p>Email: <strong>support@qsthealth.com</strong></p>
      <p>Live chat support is available in the bottom-right corner.</p>

      <hr className="divider" />

      <div className="agent-btn-container">
        <Link to="/register-agent">
          <button className="register-btn">Register as Agent</button>
        </Link>
      </div>
    </div>

     {/* Footer always stays at the bottom */}
      <Footer />
    </div>
  );
}
