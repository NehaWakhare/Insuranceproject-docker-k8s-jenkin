import IntroBanner from "../IntroBanner";
import WhyChoose from '../WhyChoose';
import HealthPlans from '../PolicyTiles/HealthPlans';
import WhyChooseUs from '../WhyChooseUs';
import Faqs from '../Faqs';
import './Home.css';
import ServiceHighlights from '../Services/ServiceHighlights';
import HowItWorks from '../HowItWorks';
import Footer from '../../../components/Footer/Footer';

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
