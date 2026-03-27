// src/Components/AboutHero.js
import React from "react";

/*
  Logo palette:
  --dark-green  : #1B3D2F
  --bright-green: #3DBE5C
  --gold        : #C9A53A
  --dark        : #1C1C1C
  --light-gray  : #F2F2EE
*/

const AboutHero = () => {
  return (
    <section style={styles.hero}>
      <div style={styles.overlay}></div>
      <div style={styles.container}>
        <span style={styles.preHeadline}>Who We Are</span>
        <h1 style={styles.headline}>
          Aligning the Right <span style={styles.accent}>Talent</span> with The{" "}
          <span style={styles.accent}>Right Opportunities</span>
        </h1>
        <p style={styles.subheadline}>
          With deep expertise in Engineering, Construction, Mining, FMCG,
          Architecture, Supply Chain, and Logistics, we go beyond matching
          resumes to job descriptions — we build lasting partnerships that
          drive long-term success.
        </p>
      </div>
      <div style={styles.bottomAccent}></div>
    </section>
  );
};

const styles = {
  hero: {
    position: "relative",
    background: "linear-gradient(135deg, #1B3D2F 0%, #0e2419 100%)",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(27,61,47,0.92) 0%, rgba(10,30,18,0.88) 100%)",
    zIndex: 1,
  },
  container: {
    position: "relative",
    zIndex: 2,
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px 2px 5px",
    textAlign: "center",
    color: "#F2F2EE",
  },
  preHeadline: {
    display: "inline-block",
    fontSize: "1rem",
    fontWeight: "600",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#C9A53A",
    marginBottom: "1rem",
    borderLeft: "3px solid #C9A53A",
    paddingLeft: "12px",
  },
  headline: {
    fontSize: "clamp(36px, 6vw, 56px)",
    fontWeight: "800",
    lineHeight: 1.2,
    marginBottom: "24px",
    color: "#F2F2EE",
  },
  accent: {
    color: "#3DBE5C",
    borderBottom: "3px solid #C9A53A",
    display: "inline-block",
    paddingBottom: "4px",
  },
  subheadline: {
    fontSize: "clamp(16px, 2vw, 20px)",
    color: "#c8d5c8",
    lineHeight: 1.6,
    maxWidth: "600px",
    margin: "0 auto",
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

export default AboutHero;