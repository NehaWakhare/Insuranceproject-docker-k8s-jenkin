import { Link } from 'react-router-dom';
import './ServiceHighlights.css';

import hospitalImg from '../assets/hospital.png';
import doctorImg from '../assets/doctor.png';
import wellnessImg from '../assets/wellness.png';

export default function ServiceHighlights() {
  return (
    <div className="service-highlights">
      {/*  Hospital */}
      <div className="highlight-card">
        <img src={hospitalImg} alt="Hospital" />
        <h3>Network Hospitals</h3>
        <p>
          Locate cashless hospitals across India with ease. Fast admission & discharge guaranteed.
        </p>
        <Link to="/hospital-search" className="btn-small">Search Hospitals</Link>
      </div>

      {/*  Teleconsultation */}
      <div className="highlight-card">
        <img src={doctorImg} alt="Teleconsult" />
        <h3>Teleconsultation</h3>
        <p>
          Talk to certified doctors online. No queues. Expert care from home.
        </p>
        <Link to="/teleconsultation" className="btn-small">Book Now</Link>
      </div>

      {/*  Wellness */}
      <div className="highlight-card">
        <img src={wellnessImg} alt="Wellness" />
        <h3>Wellness Tools</h3>
        <p>
          Guided meditations, nutrition plans, health tips — coming soon!
        </p>
        <Link to="#" className="btn-small disabled">Coming Soon</Link>
      </div>
    </div>
  );
}
