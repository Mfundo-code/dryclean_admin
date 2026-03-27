// src/Components/AboutCTA.js
import React, { useState } from "react";
import ContactFormModal from "../../../GlobalComponents/ContactFormModal"; // adjust path as needed

/*
  Logo palette:
  --dark-green  : #1B3D2F
  --bright-green: #3DBE5C
  --gold        : #C9A53A
  --dark        : #1C1C1C
  --light-gray  : #F2F2EE
*/

const AboutCTA = () => {
  const [showContactForm, setShowContactForm] = useState(false);

  const handleOpenForm = () => {
    setShowContactForm(true);
  };

  return (
    <section style={styles.cta}>
      {/* Overlay removed – image is fully visible */}
      <div style={styles.container}>
        <h2 style={styles.title}>Ready to Transform Your Recruitment Strategy?</h2>
        <p style={styles.subtitle}>
          Whether you're scaling your team, searching for transformational leadership,
          or navigating urgent staffing needs — we deliver tailored talent solutions
          for Engineering, Construction, Mining, FMCG, Architecture, Supply Chain,
          and Logistics. Let's build a partnership that powers your success.
        </p>
        <button
          style={styles.button}
          onClick={handleOpenForm}
          className="about-cta-button"
        >
          Partner With Us
        </button>
      </div>
      <ContactFormModal
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
      />
      <div style={styles.bottomAccent}></div>

      <style jsx>{`
        .about-cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(201, 165, 58, 0.4) !important;
          background: #C9A53A !important;
          color: #1B3D2F !important;
          border-color: #C9A53A !important;
        }
      `}</style>
    </section>
  );
};

const styles = {
  cta: {
    position: "relative",
    backgroundImage:
      'url("https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "100px 5%",
    textAlign: "center",
    color: "#F2F2EE", // fallback
  },
  container: {
    position: "relative",
    zIndex: 2,
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    fontSize: "clamp(32px, 5vw, 48px)",
    fontWeight: "800",
    marginBottom: "20px",
    lineHeight: 1.2,
    color: "#C9A53A", // gold
    textShadow: "0 2px 4px rgba(0,0,0,0.5)", // ensures readability on image
  },
  subtitle: {
    fontSize: "clamp(18px, 2.5vw, 24px)",
    marginBottom: "40px",
    opacity: 0.95,
    color: "#F2F2EE", // light gray
    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
  },
  button: {
    background: "transparent",
    color: "#C9A53A",
    border: "3px solid #C9A53A",
    padding: "15px 50px",
    fontSize: "1.2rem",
    fontWeight: "700",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 25px rgba(201, 165, 58, 0.25)",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(27, 61, 47, 0.2)",
    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
  },
  bottomAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, transparent, #C9A53A, transparent)",
    zIndex: 2,
  },
};

export default AboutCTA;