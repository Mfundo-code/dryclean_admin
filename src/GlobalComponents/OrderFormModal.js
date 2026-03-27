// src/GlobalComponents/OrderFormModal.js
import React, { useState, useEffect } from "react";
import api from "../api"; // adjust path if needed

const OrderFormModal = ({ isOpen, onClose, initialServiceTitle }) => {
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

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api
        .get("/services/")
        .then((res) => {
          // Handle different response formats
          let servicesData = [];
          if (Array.isArray(res.data)) {
            servicesData = res.data;
          } else if (res.data.results && Array.isArray(res.data.results)) {
            servicesData = res.data.results;
          } else if (res.data.data && Array.isArray(res.data.data)) {
            servicesData = res.data.data;
          } else {
            servicesData = [];
          }
          setAvailableServices(servicesData);

          // If initialServiceTitle is provided, find that service and pre‑select it
          if (initialServiceTitle) {
            const matchedService = servicesData.find(
              (s) => s.name === initialServiceTitle
            );
            if (matchedService) {
              setFormData((prev) => ({
                ...prev,
                services: [matchedService.id],
              }));
            }
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load services", err);
          setMessage({
            type: "error",
            text: "Could not load services. Please try again.",
          });
          setLoading(false);
        });
    }
  }, [isOpen, initialServiceTitle]);

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
      setMessage({
        type: "success",
        text: "Order placed successfully! We'll contact you shortly.",
      });
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
      const errorMsg =
        err.response?.data?.detail ||
        "Failed to place order. Please try again.";
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
          <button
            onClick={onClose}
            style={styles.modalClose}
            aria-label="Close"
          >
            ×
          </button>
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
                {availableServices.map((service) => (
                  <label key={service.id} style={styles.serviceCheckbox}>
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                    />
                    <span>
                      {service.name} – R{service.price}
                    </span>
                  </label>
                ))}
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
              <div
                style={
                  message.type === "success" ? styles.successMsg : styles.errorMsg
                }
              >
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

export default OrderFormModal;