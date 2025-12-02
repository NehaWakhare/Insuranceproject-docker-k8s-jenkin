import './WhyChoose.css';

export default function WhyChoose() {
  return (
    <section className="why-choose">
      <div className="why-choose-wrapper">
        {/* Left Section: Heading */}
        <div className="why-choose-left">
          <h2>
            What makes <span>QST</span> one of the <br />
            best places <br /> to buy insurance?
          </h2>
        </div>

        {/* Right Section: Cards */}
        <div className="why-choose-right">
          <div className="why-card one">
            <h4>Wide Range of Insurance Options</h4>
            <p>
              We offer a diverse selection of insurance policies tailored to meet your specific needs.
            </p>
          </div>
          <div className="why-card two">
            <h4>User-Friendly Interface</h4>
            <p>
              Our platform is designed for ease of use, making it simple to compare and choose the best policies.
            </p>
          </div>
          <div className="why-card three">
            <h4>Secure and Transparent</h4>
            <p>
              Your data is protected with advanced security measures, ensuring transparency at every step.
            </p>
          </div>
          <div className="why-card four">
            <h4>24/7 Customer Support</h4>
            <p>
              Our dedicated support team is available around the clock to assist you with any queries or concerns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
