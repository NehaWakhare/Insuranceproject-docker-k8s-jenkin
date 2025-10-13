import IntroBanner from '../components/IntroBanner';
import WhyChoose from '../components/WhyChoose';
import HealthPlans from '../components/HealthPlans';
import WhyChooseUs from '../components/WhyChooseUs';
import Faqs from '../components/Faqs';
import { Link } from 'react-router-dom';
import './Home.css';
import ServiceHighlights from '../components/ServiceHighlights';
import HowItWorks from '../components/HowItWorks';

export default function Home() {
  const userRole = sessionStorage.getItem('userRole');

  return (
    <div className="home-page">
      <IntroBanner />
      <WhyChooseUs />
      <HealthPlans />
          <HowItWorks />
      <div id ="policies">
     
      </div>
     {/* {userRole === 'USER' ? (
  <div className="user-actions">
    <Link to="/my-policies" className="action-btn">View/Claim Policies</Link>
  </div>
) : (
  <div className="user-actions">
    <p style={{ textAlign: 'center' }}>
      <Link to="/auth" className="action-btn">Login to view or claim your policies</Link> 
    </p>
  </div>
)} */}

          <WhyChoose />
      <ServiceHighlights />
           {/* <Faqs /> */}
      
    </div>
  );
}
