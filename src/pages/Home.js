import IntroBanner from '../components/IntroBanner';
import WhyChoose from '../components/WhyChoose';
import HealthPlans from '../components/HealthPlans';
import WhyChooseUs from '../components/WhyChooseUs';
import Faqs from '../components/Faqs';
import './Home.css';
import ServiceHighlights from '../components/ServiceHighlights';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="page-with-footer">
    <div className="home-page">
      <IntroBanner />
      <WhyChooseUs />
      <HealthPlans id="health-plans"/>
      <HowItWorks />
      <div id="policies"></div>
      <WhyChoose />
      <ServiceHighlights />
      <Faqs />
    </div>
    <Footer />
    </div>
  );
}
