import React from "react";

const TrackOrderHero = () => {
  return (
    <div style={styles.hero}>
      <div style={styles.container}>
        <h1 style={styles.title}>Track Your Order</h1>
        <p style={styles.subtitle}>
          Enter your order number and phone number to check the current status of your laundry.
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
  title: {
    fontSize: "36px",
    fontWeight: "800",
    marginBottom: "12px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "18px",
    opacity: 0.9,
    margin: 0,
  },
};

export default TrackOrderHero;