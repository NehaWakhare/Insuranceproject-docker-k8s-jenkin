import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './ServiceHighlights.css';

import hospitalImg from '../assets/hospital.png';
import doctorImg from '../assets/doctor.png';
import wellnessImg from '../assets/wellness.png';

export default function ServiceHighlights() {

  const { user } = useContext(AuthContext);   //  this is the logged-in user
  const navigate = useNavigate();

  const handleProtectedClick = (path) => {
    if (user && user.userId) {                //  correct login condition
      navigate(path);
    } else {
      alert("Please login first to view details");
      navigate("/auth");
    }
  };

  return (
    <div className="service-highlights">

      <div className="highlight-card">
        <img src={hospitalImg} alt="Hospital" />
        <h3>Network Hospitals</h3>
        <p>Find trusted hospitals and book appointments easily.</p>

        <button
          className="btn-small"
          onClick={() => handleProtectedClick("/hospital-search")}
        >
          Search Hospitals
        </button>
      </div>

      <div className="highlight-card">
        <img src={doctorImg} alt="Teleconsult" />
        <h3>Teleconsultation</h3>
        <p>Consult experienced specialists for personalized care.</p>

        <button
          className="btn-small"
          onClick={() => handleProtectedClick("/teleconsultation")}
        >
          Book Now
        </button>
      </div>

      <div className="highlight-card">
        <img src={wellnessImg} alt="Wellness" />
        <h3>Wellness Tools</h3>
        <p>Guided meditations, nutrition plans, health tips — coming soon!</p>

        <button className="btn-small disabled">
          Coming Soon
        </button>
      </div>

    </div>
  );
}
