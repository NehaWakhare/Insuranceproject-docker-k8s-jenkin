import React from "react";
import "./FooterPages.css";

export default function ChatWithUs() {
  return (
    <div className="footer-page-container">
      <h2>Chat With Us</h2>
      <p>
        We're here to help! Our support team is available to assist you with policy questions, claims,
        payments, or any other queries.
      </p>

      <div className="chat-box">
        <p><strong>Coming Soon:</strong> Live chat support will be available here.</p>
        <p>In the meantime, you can reach us at:</p>
        <ul>
          <li><strong>Email:</strong> support@example.com</li>
          <li><strong>Toll-Free:</strong> 1800 2666</li>
        </ul>
      </div>
    </div>
  );
}
