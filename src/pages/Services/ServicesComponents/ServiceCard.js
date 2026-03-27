// src/Components/ServiceCard.js (or where your ServiceCard.js lives)
import React, { useState } from "react";
import OrderFormModal from "../../../GlobalComponents/OrderFormModal";

const ServiceCard = () => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState(null);

  const handleOrderClick = (serviceTitle) => {
    setSelectedServiceTitle(serviceTitle);
    setIsOrderModalOpen(true);
  };

  const services = [
    {
      id: 1,
      title: "Dry Cleaning",
      description:
        "Expert care for delicate fabrics and special garments. We use gentle solvents that preserve colour, texture, and shape while removing stubborn stains.",
      icon: "https://api.iconify.design/mdi:tshirt-crew.svg?color=%232C6B8F",
    },
    {
      id: 2,
      title: "Wash & Fold",
      description:
        "Drop off your laundry and we’ll wash, dry, and fold it to perfection. Perfect for busy individuals and families – same-day service available.",
      icon: "https://api.iconify.design/mdi:washing-machine.svg?color=%232C6B8F",
    },
    {
      id: 3,
      title: "Ironing & Pressing",
      description:
        "Get wrinkle‑free, professionally pressed clothes that look crisp and fresh. We handle everything from shirts to trousers with precision.",
      icon: "https://api.iconify.design/mdi:iron.svg?color=%232C6B8F",
    },
    {
      id: 4,
      title: "Stain Removal",
      description:
        "Tough stains don’t stand a chance. Our trained technicians treat spots safely, even on delicate fabrics – wine, oil, ink, grass, and more.",
      // Use a reliable icon from MDI
      icon: "https://api.iconify.design/mdi:spray-bottle.svg?color=%232C6B8F",
    },
    {
      id: 5,
      title: "Wedding Gown Care",
      description:
        "Your wedding dress deserves the best. Gentle cleaning, preservation, and archival packaging to keep it pristine for generations.",
      icon: "https://api.iconify.design/mdi:ring.svg?color=%232C6B8F",
    },
    {
      id: 6,
      title: "Commercial Laundry",
      description:
        "Reliable, high‑volume laundry services for hotels, restaurants, and businesses. Custom pickup and delivery schedules available.",
      icon: "https://api.iconify.design/mdi:office-building.svg?color=%232C6B8F",
    },
  ];

  const styles = {
    servicesSection: {
      padding: "0 5% 80px",
      backgroundColor: "#FFFFFF",
    },
    sectionHeading: {
      textAlign: "center",
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#1E2A3A",
      marginBottom: "60px",
    },
    servicesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "40px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    serviceCard: {
      background: "#FFFFFF",
      borderRadius: "15px",
      padding: "40px",
      boxShadow: "0 15px 35px rgba(30,42,58,0.08)",
      transition: "all 0.3s ease",
      borderBottom: "4px solid #C9A53A",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    serviceIcon: {
      width: "80px",
      height: "80px",
      marginBottom: "25px",
      background: "#F5F7FA",
      borderRadius: "12px",
      padding: "15px",
      boxSizing: "border-box",
      boxShadow: "0 8px 20px rgba(30,42,58,0.1)",
    },
    serviceTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "20px",
      color: "#1E2A3A",
    },
    serviceText: {
      color: "#4A5568",
      lineHeight: "1.8",
      margin: 0,
      fontWeight: "400",
    },
    orderButton: {
      marginTop: "24px",
      backgroundColor: "#2C6B8F",        // blue background
      border: "2px solid #C9A53A",       // gold border
      borderRadius: "6px",
      padding: "10px 20px",
      color: "#FFFFFF",                  // white text
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      width: "100%",
      textAlign: "center",
    },
    orderButtonHover: {
      backgroundColor: "#1E2A3A",        // darker navy on hover
      borderColor: "#C9A53A",
      color: "#FFFFFF",
    },
  };

  return (
    <>
      <section style={styles.servicesSection}>
        <h2 style={styles.sectionHeading}>Our Services</h2>
        <div style={styles.servicesGrid}>
          {services.map((service) => (
            <div key={service.id} className="service-card" style={styles.serviceCard}>
              <img
                src={service.icon}
                alt={service.title}
                style={styles.serviceIcon}
              />
              <h3 style={styles.serviceTitle}>{service.title}</h3>
              <p style={styles.serviceText}>{service.description}</p>
              <button
                style={styles.orderButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1E2A3A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2C6B8F";
                }}
                onClick={() => handleOrderClick(service.title)}
              >
                Place Order
              </button>
            </div>
          ))}
        </div>

        <style>{`
          .service-card:hover {
            background: #F5F7FA !important;
            transform: translateY(-8px);
            box-shadow: 0 30px 50px rgba(30,42,58,0.15) !important;
            border-bottom-color: #b8922e;
          }
        `}</style>
      </section>

      <OrderFormModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialServiceTitle={selectedServiceTitle}
      />
    </>
  );
};

export default ServiceCard;