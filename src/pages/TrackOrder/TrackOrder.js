import React, { useState } from "react";
import api from "../../api";
import TrackOrderHero from "./TrackOrderHero";

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrderData(null);

    try {
      const response = await api.get("/order/status/", {
        params: { order_number: orderNumber, phone },
      });
      setOrderData(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Order not found. Please check your order number and phone number.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <TrackOrderHero />
      <div style={styles.container}>
        <div style={styles.card}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="orderNumber" style={styles.label}>
                Order Number *
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. ORD-20250326-0001"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="phone" style={styles.label}>
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0712345678"
                required
                style={styles.input}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={loading ? styles.buttonDisabled : styles.button}
            >
              {loading ? "Checking..." : "Track Order"}
            </button>
          </form>

          {error && <div style={styles.error}>{error}</div>}

          {orderData && (
            <div style={styles.result}>
              <h2 style={styles.resultTitle}>Order Status</h2>
              <div style={styles.resultRow}>
                <strong>Order Number:</strong> {orderData.order_number}
              </div>
              <div style={styles.resultRow}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(orderData.status),
                  }}
                >
                  {orderData.status_display}
                </span>
              </div>
              <div style={styles.resultRow}>
                <strong>Last Updated:</strong>{" "}
                {new Date(orderData.updated_at).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "received":
      return "#C9A53A";
    case "inspecting":
      return "#2C6B8F";
    case "cleaning":
      return "#1E2A3A";
    case "ready":
      return "#4CAF50";
    case "collected":
      return "#9E9E9E";
    case "delivered":
      return "#4CAF50";
    default:
      return "#CBD5E0";
  }
};

const styles = {
  page: {
    backgroundColor: "#F5F7FA",
    minHeight: "100vh",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    maxWidth: "500px",
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    padding: "32px",
    borderTop: "4px solid #C9A53A",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: "600",
    color: "#1E2A3A",
    fontSize: "14px",
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #CBD5E0",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    backgroundColor: "#2C6B8F",
    color: "#FFFFFF",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    backgroundColor: "#A0AEC0",
    color: "#FFFFFF",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "not-allowed",
  },
  error: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#FED7D7",
    color: "#9B2C2C",
    borderRadius: "8px",
    fontSize: "14px",
    textAlign: "center",
  },
  result: {
    marginTop: "24px",
    padding: "20px",
    backgroundColor: "#F5F7FA",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
  },
  resultTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1E2A3A",
    marginBottom: "16px",
  },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    fontSize: "14px",
    color: "#2D3748",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#FFFFFF",
  },
};

export default TrackOrder;