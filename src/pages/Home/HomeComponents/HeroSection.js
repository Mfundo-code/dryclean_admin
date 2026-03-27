// src/Components/HeroSection.js
import React, { useState } from "react";
import ContactFormModal from "../../../GlobalComponents/ContactFormModal";
import heroImage from "../../../assets/images/dry-cleaning-hero.jpg";

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        style={{
          ...styles.hero,
          backgroundImage: `url(${heroImage})`,
        }}
      >
        {/* Overlay removed – image is now clear */}

        {/* Content container */}
        <div style={styles.container}>
          <div style={styles.textColumn}>
            <h1 style={styles.headline}>
              Expert Dry Cleaning &<br />
              <span style={styles.accent}>Laundry Services</span>
            </h1>
            <p style={styles.subheadline}>
              Quality care for your garments with a commitment to freshness, reliability,
              and professional service. From everyday wear to special occasion attire,
              we handle it all with precision.
            </p>
            <button
              style={styles.cta}
              aria-label="Get a Quote"
              onClick={() => setIsModalOpen(true)}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#C9A53A';
                e.currentTarget.style.color = '#1E2A3A';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#C9A53A';
              }}
            >
              Get a Quote <span style={styles.plus}>+</span>
            </button>
          </div>
        </div>
      </section>

      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

/*
  Color palette:
  --primary-blue   : #2C6B8F (accent)
  --navy-dark      : #1E2A3A (used in button hover)
  --gold           : #C9A53A (CTA button)
  --white          : #FFFFFF (text)
  --grey-light     : #F5F7FA (subtext)
*/

const styles = {
  hero: {
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },
  // overlay removed
  container: {
    position: "relative", // z-index not needed as no overlay
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "60px 40px",
    width: "100%",
  },
  textColumn: {
    maxWidth: "600px",
    color: "#FFFFFF",
    textShadow: "1px 1px 3px rgba(0,0,0,0.6)", // helps readability on images
  },
  headline: {
    fontSize: "clamp(36px, 5vw, 58px)",
    fontWeight: "800",
    lineHeight: 1.2,
    marginBottom: "20px",
    color: "#FFFFFF",
    textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
  },
  accent: {
    color: "#2C6B8F",
    borderBottom: "3px solid #C9A53A",
    display: "inline-block",
    paddingBottom: "4px",
  },
  subheadline: {
    fontSize: "clamp(16px, 2vw, 18px)",
    color: "#F5F7FA",
    marginBottom: "36px",
    lineHeight: 1.7,
    maxWidth: "480px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  },
  cta: {
    background: "transparent",
    border: "2px solid #C9A53A",
    borderRadius: "6px",
    padding: "14px 32px",
    color: "#C9A53A",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
    letterSpacing: "0.3px",
  },
  plus: {
    fontSize: "20px",
    lineHeight: 1,
  },
};

export default HeroSection;