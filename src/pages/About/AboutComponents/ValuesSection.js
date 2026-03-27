// src/Components/ValuesSection.js
import React from "react";

/*
  Logo palette:
  --dark-green  : #1B3D2F
  --bright-green: #3DBE5C
  --gold        : #C9A53A
  --dark        : #1C1C1C
  --light-gray  : #F2F2EE
*/

const ValuesSection = () => {
  const values = [
    {
      title: "Integrity",
      description:
        "We believe in transparent processes, honest communication, and ethical practices. Both clients and candidates trust us to deliver on our promises, maintain confidentiality, and act with professionalism at every stage.",
      icon: "https://api.iconify.design/mdi:handshake.svg?color=%23C9A53A", // gold
    },
    {
      title: "Commitment to Diversity",
      description:
        "We are passionate advocates for inclusive workplaces. Diversity drives innovation, enhances company culture, and delivers better business outcomes. We actively work to eliminate bias and create opportunities for talent from all backgrounds.",
      icon: "https://api.iconify.design/mdi:account-group.svg?color=%233DBE5C", // bright-green
    },
    {
      title: "Focus on Long-term Relationships",
      description:
        "We're not in the business of simply filling positions — we're building partnerships. By deeply understanding unique needs, aspirations, and challenges, we create lasting relationships that drive mutual success far beyond individual placements.",
      icon: "https://api.iconify.design/mdi:hand-heart.svg?color=%23C9A53A", // gold
    },
  ];

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <span style={styles.tag}>Our Values</span>
        <h2 style={styles.heading}>What Drives Us</h2>
        <div style={styles.grid}>
          {values.map((value, index) => (
            <div key={index} style={styles.card}>
              <img src={value.icon} alt={value.title} style={styles.icon} />
              <h3 style={styles.cardTitle}>{value.title}</h3>
              <p style={styles.cardText}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: "80px 5%",
    backgroundColor: "#F2F2EE", // light-gray
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center",
  },
  tag: {
    display: "inline-block",
    fontSize: "1rem",
    fontWeight: "600",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#C9A53A", // gold
    marginBottom: "1rem",
    borderLeft: `3px solid #C9A53A`, // gold
    paddingLeft: "12px",
  },
  heading: {
    fontSize: "clamp(32px, 5vw, 48px)",
    fontWeight: "700",
    color: "#1B3D2F", // dark-green
    marginBottom: "60px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  card: {
    background: "#FFFFFF", // white card for contrast on light-gray bg
    borderRadius: "15px",
    padding: "40px 30px",
    boxShadow: "0 15px 35px rgba(27,61,47,0.1)", // soft dark-green shadow
    transition: "all 0.3s ease",
    borderBottom: "4px solid #C9A53A", // gold accent
    textAlign: "center",
  },
  icon: {
    width: "70px",
    height: "70px",
    marginBottom: "20px",
    background: "#F2F2EE", // light-gray background for icons
    borderRadius: "12px",
    padding: "15px",
    boxSizing: "border-box",
    boxShadow: "0 8px 20px rgba(27,61,47,0.1)", // subtle dark-green shadow
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#1B3D2F", // dark-green
  },
  cardText: {
    color: "#2e4a38", // a softer dark-green variant for readability
    lineHeight: "1.7",
    margin: 0,
  },
};

export default ValuesSection;