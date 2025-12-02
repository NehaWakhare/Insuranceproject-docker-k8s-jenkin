import './WhyChooseUs.css';
import { FaUserShield, FaBolt, FaHeadset, FaRobot } from 'react-icons/fa';

export default function WhyChooseUs() {
  return (
    <section className="why-choose-us">
      <h2>Why Choose QST Health Insurance?</h2>
      <div className="reasons-grid">
        <div className="reason-card highlight-blue">
            <FaUserShield className="reason-icon" />
          <h3>Trusted by Thousands</h3>
          <p>Join the community of customers who rely on QST for their health and wellness needs.</p>
        </div>

        <div className="reason-card highlight-green">
            <FaBolt className="reason-icon" />
          <h3>Instant Policy Issuance</h3>
          <p>Get your insurance policy issued within minutes – simple, fast and seamless.</p>
        </div>

        <div className="reason-card highlight-purple">
            <FaHeadset className="reason-icon" />
          <h3>24/7 Support</h3>
          <p>Reach our dedicated customer support team anytime, anywhere.</p>
        </div>

        <div className="reason-card highlight-orange">
           <FaRobot className="reason-icon" />
          <h3>AI-Advisor</h3>
          <p>Our smart tools suggest the best plans tailored to your health profile and lifestyle.</p>
        </div>
      </div>
    </section>
  );
}
