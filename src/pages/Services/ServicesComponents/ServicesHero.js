// src/Components/ServicesHero.js
import React from "react";

const ServicesHero = () => {
  return (
    <div style={styles.hero}>
      <div style={styles.container}>
        <span style={styles.preheadline}>Our Services</span>
        <h1 style={styles.headline}>
          Professional Dry Cleaning & Laundry Solutions
        </h1>
        <p style={styles.subheadline}>
          From everyday wear to delicate fabrics, we deliver expert care with a
          commitment to freshness and reliability. Explore our range of services
          tailored to your needs.
        </p>
      </div>
    </div>
  );
};

const styles = {
  hero: {
    backgroundColor: "#1E2A3A",
    backgroundImage: "linear-gradient(135deg, #1E2A3A 0%, #2C6B8F 100%)",
    padding: "40px 20px",
    textAlign: "center",
    color: "#FFFFFF",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  preheadline: {
    display: "inline-block",
    fontSize: "0.85rem",
    fontWeight: "600",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#C9A53A",
    marginBottom: "12px",
    borderLeft: "3px solid #C9A53A",
    paddingLeft: "12px",
  },
  headline: {
    fontSize: "36px",
    fontWeight: "800",
    marginBottom: "12px",
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
  },
  subheadline: {
    fontSize: "18px",
    opacity: 0.9,
    margin: 0,
    lineHeight: 1.5,
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
  },
};

export default ServicesHero;