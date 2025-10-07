import './IntroBanner.css';
import { Link } from 'react-router-dom';
import familyImg from '../assets/family-health.png';

export default function IntroBanner() {
  return (
    <section className="intro-banner-wrapper">
      <div className="intro-banner">
        <div className="banner-left">
          <h1>Secure Your Health and Future with QST Insurance</h1>
          <p>Comprehensive protection for health, travel, life, and more — trusted by millions.</p>
          <Link to="/health-plans" className="banner-btn">Explore Policies</Link>
        </div>
        <div className="banner-right">
          <img src={familyImg} alt="Family Health" />
        </div>
      </div>
    </section>
  );
}
