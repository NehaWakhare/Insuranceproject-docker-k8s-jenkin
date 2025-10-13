import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Faqs.css'; 

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  // Fetch FAQs from backend
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/faq/all'); // adjust backend URL if needed
        setFaqs(response.data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };
    fetchFaqs();
  }, []);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div
          key={faq.id || index}
          className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          onClick={() => toggle(index)}
        >
          <div className="faq-question">
            <span>{`${index + 1}. ${faq.question}`}</span>
            <span className="faq-toggle">{activeIndex === index ? '–' : '+'}</span>
          </div>
          {activeIndex === index && <div className="faq-answer">{faq.answer}</div>}
        </div>
      ))}
    </div>
  );
}
