import React from 'react';
import './HowItWorks.css';
import { FaSearch, FaBalanceScale, FaCheckCircle } from 'react-icons/fa';

export default function HowItWorks() {
  return (
    <section className="hiw-flow-section">
      <h2 className="hiw-flow-title">How QST Insurance Works</h2>
      <div className="hiw-flow">
        <div className="hiw-step">
          <FaSearch size={40} color="#003b6f" />
          <h3>Search Plans</h3>
          <p>Find the best-suited insurance options.</p>
        </div>
        <div className="hiw-arrow">→</div>

        <div className="hiw-step">
          <FaBalanceScale size={40} color="#003b6f" />
          <h3>Compare & Customize</h3>
          <p>Review coverage & personalize your plan.</p>
        </div>
        <div className="hiw-arrow">→</div>

        <div className="hiw-step">
          <FaCheckCircle size={40} color="#003b6f" />
          <h3>Buy & Relax</h3>
          <p>Complete purchase and enjoy peace of mind.</p>
        </div>
      </div>
    </section>
  );
}
