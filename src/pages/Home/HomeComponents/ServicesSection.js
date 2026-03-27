// src/Components/ServicesSection.jsx
import React, { useState } from "react";
import ContactFormModal from "../../../GlobalComponents/ContactFormModal"; // adjust path if necessary

const NAVY_DARK   = "#1E2A3A";
const PRIMARY_BLUE = "#2C6B8F";
const GOLD        = "#C9A53A";
const WHITE       = "#FFFFFF";
const LIGHT_GREY  = "#F5F7FA";
const CARD_BG     = WHITE;
const CARD_HOVER_BG = LIGHT_GREY;

const services = [
  {
    id: 1,
    tag: "Expert Care",
    title: "Dry Cleaning",
    description:
      "Professional dry cleaning for delicate fabrics and special garments. We use gentle solvents that preserve colour, texture, and shape.",
    bullets: ["Delicate fabric specialists", "Stain removal expertise", "Odour elimination"],
  },
  {
    id: 2,
    tag: "Convenient",
    title: "Wash & Fold",
    description:
      "Drop off your laundry and we'll wash, dry, and fold it to perfection. Perfect for busy individuals and families.",
    bullets: ["Same-day service available", "Custom folding preferences", "Eco-friendly detergents"],
  },
  {
    id: 3,
    tag: "Crisp Finish",
    title: "Ironing & Pressing",
    description:
      "Get wrinkle-free, professionally pressed clothes that look crisp and fresh. We handle everything from shirts to trousers.",
    bullets: ["Shirts & blouses", "Suits & trousers", "Delicate pressing"],
  },
  {
    id: 4,
    tag: "Specialist",
    title: "Stain Removal",
    description:
      "Tough stains don't stand a chance. Our trained technicians treat spots and stains safely, even on delicate fabrics.",
    bullets: ["Wine, oil, ink, grass", "Pre-treatment consultation", "Safe for all fabrics"],
  },
  {
    id: 5,
    tag: "Treasure",
    title: "Wedding Gown Care",
    description:
      "Your wedding dress deserves the best. We offer gentle cleaning, preservation, and archival packaging to keep it pristine for years.",
    bullets: ["Hand-inspected", "Acid-free packaging", "Heirloom preservation"],
  },
  {
    id: 6,
    tag: "Business",
    title: "Commercial Laundry",
    description:
      "Reliable, high-volume laundry services for hotels, restaurants, and businesses. Custom pickup and delivery schedules available.",
    bullets: ["Linen & uniform service", "Flexible contracts", "Quick turnaround"],
  },
];

const ServicesSection = () => {
  const [hovered, setHovered] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);

  return (
    <>
      <section style={styles.section} aria-labelledby="services-heading">
        <style>{`
          @keyframes lift { from { transform: translateY(6px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
          @keyframes popBlue {
            0% { transform: translateY(12px) scale(0.98); opacity: 0; }
            50% { transform: translateY(-6px) scale(1.02); opacity: 1; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
          }
          .heading-animate {
            animation: popBlue 900ms cubic-bezier(.2,.9,.25,1) both;
            color: ${NAVY_DARK};
          }
          @media (max-width: 980px) {
            .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 620px) {
            .services-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        <div style={styles.container}>
          <header style={styles.header}>
            <h2 id="services-heading" className="heading-animate" style={styles.headingBig}>
              Our Services
            </h2>
          </header>

          <div className="services-grid" style={styles.grid}>
            {services.map((service, idx) => {
              const isHovered = hovered === service.id;
              return (
                <article
                  key={service.id}
                  onMouseEnter={() => setHovered(service.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    ...styles.card,
                    ...(isHovered ? styles.cardHovered : {}),
                    animation: `lift 420ms cubic-bezier(.2,.9,.25,1) both`,
                    animationDelay: `${idx * 60}ms`,
                  }}
                >
                  <div style={{ ...styles.cardTopAccent, opacity: isHovered ? 1 : 0.5 }} />

                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div
                      style={{
                        ...styles.iconWrap,
                        color: isHovered ? GOLD : PRIMARY_BLUE,
                        background: isHovered ? `rgba(201,165,58,0.15)` : `rgba(44,107,143,0.1)`,
                      }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M6 6.5L8 4h8l2 2.5-3 1.5-2-2-2 2-3-1.5z" />
                        <path d="M8 7v11h8V7" />
                      </svg>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={styles.tagRow}>
                        <span style={{ ...styles.tag, color: isHovered ? GOLD : PRIMARY_BLUE }}>
                          {service.tag}
                        </span>
                      </div>

                      <h3 style={styles.cardTitle}>{service.title}</h3>
                      <p style={styles.cardDesc}>{service.description}</p>

                      <ul style={styles.bullets} aria-hidden={isHovered ? "false" : "true"}>
                        {service.bullets.map((b, i) => (
                          <li key={i} style={styles.bulletItem}>
                            <span
                              style={{
                                ...styles.bulletDot,
                                background: isHovered ? GOLD : PRIMARY_BLUE,
                              }}
                            />
                            <span style={{ color: NAVY_DARK }}>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Replaced "Explore" button with "Place Order" */}
                      <div style={{ marginTop: 16 }}>
                        <button
                          onClick={openContactModal}
                          style={styles.orderButton}
                          aria-label={`Place order for ${service.title}`}
                        >
                          Place Order
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div style={styles.bottomStrip}>
            <p style={styles.stripText}>
              Need special care or a custom solution? Our team is ready to help.
            </p>
            <a href="/contact" style={styles.stripButton}>
              Contact us
            </a>
          </div>
        </div>
      </section>

      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
};

const styles = {
  section: {
    position: "relative",
    padding: "56px 0",
    backgroundColor: WHITE,
    overflow: "visible",
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 20px",
    position: "relative",
    zIndex: 2,
  },
  header: { textAlign: "center", marginBottom: 28 },
  headingBig: {
    fontSize: "clamp(28px, 6vw, 56px)",
    fontWeight: 900,
    margin: 0,
    letterSpacing: "-1px",
    color: NAVY_DARK,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 18,
  },
  card: {
    position: "relative",
    background: CARD_BG,
    borderRadius: 15,
    padding: 18,
    transition: "all 0.3s ease",
    overflow: "hidden",
    minHeight: 180,
    borderBottom: "4px solid transparent",
    boxShadow: "0 15px 35px rgba(30,42,58,0.12)",
  },
  cardHovered: {
    transform: "translateY(-8px)",
    boxShadow: "0 30px 50px rgba(30,42,58,0.20)",
    borderBottomColor: GOLD,
    background: CARD_HOVER_BG,
  },
  cardTopAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
    transition: "opacity 0.22s ease",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s",
    boxShadow: "0 8px 20px rgba(30,42,58,0.15)",
  },
  tagRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 6 },
  tag: { fontSize: 11, fontWeight: 700, textTransform: "uppercase" },
  cardTitle: { fontSize: 18, fontWeight: 800, color: NAVY_DARK, margin: "6px 0" },
  cardDesc: { fontSize: 13, color: "#4A5568", lineHeight: 1.6, margin: 0 },
  bullets: { listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 8 },
  bulletItem: { display: "flex", alignItems: "center", gap: 10, fontSize: 13 },
  bulletDot: { width: 6, height: 6, borderRadius: 6, flexShrink: 0 },
  orderButton: {
    background: PRIMARY_BLUE,
    color: WHITE,
    border: "none",
    padding: "8px 16px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.2s ease",
    width: "100%",
    boxShadow: "0 2px 6px rgba(44,107,143,0.3)",
  },
  bottomStrip: {
    marginTop: 28,
    padding: "20px",
    background: LIGHT_GREY,
    borderRadius: 12,
    border: `1px solid ${GOLD}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  stripText: { margin: 0, color: NAVY_DARK, fontWeight: 600 },
  stripButton: {
    background: PRIMARY_BLUE,
    color: WHITE,
    padding: "10px 18px",
    borderRadius: 8,
    fontWeight: 700,
    textDecoration: "none",
    transition: "all 0.2s",
    border: `2px solid ${GOLD}`,
  },
};

export default ServicesSection;