import React, { useEffect, useState } from "react";
import "./Faqs.css";
import CONFIG from "../config/config";

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [expandedAnswers, setExpandedAnswers] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
           const response = await fetch(`${CONFIG.BASE_URL}/faq/all`);
        if (!response.ok) throw new Error("Failed to fetch FAQs");
        const data = await response.json();
        setFaqs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const toggleReadMore = (index) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) return <div className="faq-container">Loading FAQs...</div>;
  if (error) return <div className="faq-container error">Error: {error}</div>;

  return (
    <div className="faq-container">
      <h2 className="faq-heading">Frequently Asked Questions</h2>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const isExpanded = expandedAnswers[index];
        const answerTooLong = faq.answer.length > 150; 
        const displayAnswer =
          answerTooLong && !isExpanded
            ? faq.answer.slice(0, 150) + "..."
            : faq.answer;

        return (
          <div key={faq.id} className="faq-card">
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span className="faq-number">{index + 1}.</span>{" "}
              {faq.question}
              <span className="faq-icon">{isOpen ? "−" : "+"}</span>
            </div>

            {isOpen && (
              <div className={`faq-answer ${isOpen ? "open" : ""}`}>
                {displayAnswer}
                {answerTooLong && (
                  <span
                    className="read-more-toggle"
                    onClick={() => toggleReadMore(index)}
                    style={{ color: "#007bff", cursor: "pointer", marginLeft: "5px" }}
                  >
                    {isExpanded ? "Read less" : "Read more"}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
