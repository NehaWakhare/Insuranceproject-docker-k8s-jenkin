import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="pb-footer">
    
      <div className="pb-footer-top">

        <div className="pb-col">
          <h4>Contact & Support</h4>
          <ul>
            <li>Toll‑Free: 1800 2666</li>
            <li>Email: <a href="mailto:support@example.com">support@example.com</a></li>
            
            <li><a href="/chat">Chat with Us</a></li>
          </ul>
        </div>

        <div className="pb-col">
          <h4>About Us</h4>
          <ul>
            <li><a href="/about">Company Overview</a></li>
            <li><a href="/team">Leadership Team</a></li>
            {/* <li><a href="/careers">Careers</a></li> */}
            <li><a href="/media">Press & Media</a></li>
          </ul>
        </div>

        <div className="pb-col">
          <h4>Legal Disclosures</h4>
          <ul>
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            {/* <li><a href="/irda">IRDAI Compliance</a></li> */}
            <li><a href="/disclaimer">Disclaimer</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom legal section */}
      <div className="pb-footer-bottom">
        <p>© {new Date().getFullYear()} Your Insurance Co. All Rights Reserved.</p>
        <p>
          Insurance is a subject matter of solicitation. Read our <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </footer>
  );
}
