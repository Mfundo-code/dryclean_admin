// src/pages/Home/HomeComponents/CallToActionSection.js
import React, { useState, useEffect } from "react";
import api from "../../../api";

const OrderFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_address: "",
    services: [],
    notes: "",
  });
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch services when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.get("/services/")
        .then((res) => {
          // Handle different response formats
          let servicesData = [];
          if (Array.isArray(res.data)) {
            servicesData = res.data;
          } else if (res.data.results && Array.isArray(res.data.results)) {
            servicesData = res.data.results; // for DRF paginated response
          } else if (res.data.data && Array.isArray(res.data.data)) {
            servicesData = res.data.data;
          } else {
            console.warn("Unexpected services response:", res.data);
            servicesData = [];
          }
          setAvailableServices(servicesData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load services", err);
          setMessage({ type: "error", text: "Could not load services. Please try again." });
          setLoading(false);
        });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (serviceId) => {
    setFormData((prev) => {
      const services = prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    if (formData.services.length === 0) {
      setMessage({ type: "error", text: "Please select at least one service." });
      setSubmitting(false);
      return;
    }

    try {
      await api.post("/order/create/", formData);
      setMessage({ type: "success", text: "Order placed successfully! We'll contact you shortly." });
      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        setFormData({
          customer_name: "",
          customer_phone: "",
          customer_email: "",
          customer_address: "",
          services: [],
          notes: "",
        });
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Order submission error", err);
      const errorMsg = err.response?.data?.detail || "Failed to place order. Please try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Place Your Order</h3>
          <button onClick={onClose} style={styles.modalClose} aria-label="Close">×</button>
        </div>
        {loading ? (
          <div style={styles.modalLoading}>Loading services...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number *</label>
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Address (optional)</label>
              <textarea
                name="customer_address"
                value={formData.customer_address}
                onChange={handleChange}
                rows="2"
                style={styles.textarea}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Services *</label>
              <div style={styles.servicesGrid}>
                {availableServices.length === 0 ? (
                  <p style={{ color: "#A0AEC0" }}>No services available. Please try again later.</p>
                ) : (
                  availableServices.map((service) => (
                    <label key={service.id} style={styles.serviceCheckbox}>
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                      />
                      <span>{service.name} – R{service.price}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Notes (special instructions)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                style={styles.textarea}
                placeholder="E.g., stain type, pickup instructions..."
              />
            </div>
            {message.text && (
              <div style={message.type === "success" ? styles.successMsg : styles.errorMsg}>
                {message.text}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              style={submitting ? styles.submitBtnDisabled : styles.submitBtn}
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const CallToActionSection = () => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <>
      <section className="cta-container">
        <div className="cta-content">
          <div className="cta-text-section">
            <h2 className="cta-title">Need Your Clothes Looking Their Best?</h2>
            <p className="cta-description">
              From everyday wear to delicate fabrics, we provide expert dry cleaning
              and laundry services that leave your garments fresh, crisp, and perfectly
              pressed. Place your order online and we'll take care of the rest.
            </p>
          </div>

          <div className="cta-spacer"></div>

          <div className="cta-contact-section">
            <button
              className="cta-order-wrapper"
              onClick={() => setIsOrderModalOpen(true)}
              aria-label="Place an order"
            >
              <div className="cta-order-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 7h-4.18A3 3 0 0 0 13 4h-2a3 3 0 0 0-2.82 3H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                  <line x1="12" y1="12" x2="12" y2="18" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <div className="cta-order-content">
                <div className="cta-order-text">Place an Order</div>
                <div className="cta-order-subtext">Quick & Easy</div>
              </div>
            </button>
          </div>
        </div>

        <style jsx>{`
          .cta-container {
            padding: 100px 2rem 5rem;
            background: linear-gradient(135deg, #1E2A3A 0%, #0F1923 100%);
            color: #FFFFFF;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            position: relative;
            z-index: 1;
          }

          .cta-container::before {
            content: "";
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            background: #C9A53A;
            border-radius: 2px;
          }

          .cta-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
          }

          .cta-text-section {
            flex: 1;
            min-width: 300px;
            max-width: 65%;
          }

          .cta-spacer {
            width: 5%;
            min-width: 40px;
          }

          .cta-contact-section {
            flex: 0 0 auto;
            min-width: 250px;
          }

          .cta-title {
            font-size: 3rem;
            font-weight: 800;
            margin: 0 0 1.5rem 0;
            color: #FFFFFF;
            line-height: 1.2;
          }

          .cta-description {
            font-size: 1.15rem;
            line-height: 1.7;
            margin: 0;
            color: #F5F7FA;
            opacity: 0.9;
          }

          .cta-order-wrapper {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem 2rem;
            background: rgba(201, 165, 58, 0.08);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            border: 2px solid #C9A53A;
            color: #FFFFFF;
            box-shadow: 0 0 24px rgba(201, 165, 58, 0.15);
            transition: all 0.3s ease;
            cursor: pointer;
            width: 100%;
            text-align: left;
            outline: none;
          }

          .cta-order-wrapper:hover {
            transform: translateY(-2px);
            background: rgba(201, 165, 58, 0.15);
            box-shadow: 0 0 36px rgba(201, 165, 58, 0.28);
          }

          .cta-order-wrapper:active {
            transform: translateY(0);
          }

          .cta-order-icon {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(201, 165, 58, 0.15);
            border-radius: 50%;
            color: #C9A53A;
            flex-shrink: 0;
          }

          .cta-order-content {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .cta-order-text {
            font-size: 1.2rem;
            font-weight: 700;
            color: #C9A53A;
          }

          .cta-order-subtext {
            font-size: 0.8rem;
            color: #F5F7FA;
            opacity: 0.8;
          }

          @media (max-width: 768px) {
            .cta-container {
              padding: 90px 1rem 3rem;
            }

            .cta-content {
              flex-direction: column;
              text-align: center;
              gap: 2rem;
            }

            .cta-text-section {
              max-width: 100%;
              text-align: center;
            }

            .cta-title {
              font-size: 2rem;
            }

            .cta-description {
              font-size: 1.05rem;
              padding: 0 1rem;
            }

            .cta-spacer {
              display: none;
            }

            .cta-order-wrapper {
              flex-direction: column;
              text-align: center;
              padding: 1.5rem;
              margin: 0 auto;
              justify-content: center;
            }

            .cta-order-content {
              align-items: center;
            }

            .cta-order-text {
              font-size: 1.1rem;
            }
          }

          @media (max-width: 480px) {
            .cta-title {
              font-size: 1.8rem;
            }

            .cta-description {
              font-size: 1rem;
            }

            .cta-order-wrapper {
              padding: 1.25rem;
            }
          }
        `}</style>
      </section>

      <OrderFormModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </>
  );
};

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "24px",
    position: "relative",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "2px solid #C9A53A",
    paddingBottom: "12px",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1E2A3A",
    margin: 0,
  },
  modalClose: {
    background: "none",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
    color: "#4A5568",
    padding: "0 8px",
    lineHeight: 1,
  },
  modalLoading: {
    textAlign: "center",
    padding: "40px",
    color: "#2C6B8F",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#1E2A3A",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #CBD5E0",
    borderRadius: "6px",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #CBD5E0",
    borderRadius: "6px",
    fontSize: "1rem",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "12px",
    marginTop: "8px",
  },
  serviceCheckbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.9rem",
    color: "#2D3748",
  },
  successMsg: {
    backgroundColor: "#C6F6D5",
    color: "#22543D",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "0.9rem",
  },
  errorMsg: {
    backgroundColor: "#FED7D7",
    color: "#9B2C2C",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "0.9rem",
  },
  submitBtn: {
    backgroundColor: "#2C6B8F",
    color: "#FFFFFF",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    transition: "background 0.2s",
  },
  submitBtnDisabled: {
    backgroundColor: "#A0AEC0",
    color: "#FFFFFF",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "not-allowed",
    width: "100%",
  },
};

export default CallToActionSection;