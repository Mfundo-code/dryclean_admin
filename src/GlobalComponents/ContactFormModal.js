// src/GlobalComponents/ContactFormModal.js
import React, { useState, useEffect } from "react";

const ContactFormModal = ({ isOpen, onClose, inline = false }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [visible, setVisible] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (isOpen) setTimeout(() => setVisible(true), 10);
    else {
      setVisible(false);
      setTimeout(() => setEmailSent(false), 400);
    }
  }, [isOpen]);

  const API_URL =
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000/api/contact/"
      : "https://yourdomain.com/api/contact/"; // replace with your production URL

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus({ type: "error", message: "Please fill in all fields." });
      setIsSubmitting(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({ type: "error", message: "Please enter a valid email address." });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEmailSent(true);
        setSubmitStatus({
          type: "success",
          message: `Confirmation email sent to ${formData.email}`,
        });
        setFormData({ name: "", email: "", message: "" });
        if (!inline) setTimeout(() => { setVisible(false); setTimeout(onClose, 400); }, 3200);
      } else {
        const err = await response.json().catch(() => ({}));
        let msg = "Something went wrong. Please try again.";
        if (response.status === 400) {
          const k = Object.keys(err)[0];
          if (k) msg = `${k}: ${Array.isArray(err[k]) ? err[k][0] : err[k]}`;
        } else if (response.status === 500) {
          msg = "Server error — your message was saved but the confirmation email could not be delivered. We will still be in touch.";
        }
        setSubmitStatus({ type: "error", message: msg });
      }
    } catch {
      setSubmitStatus({ type: "error", message: "Network error. Check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldStyle = (name) => ({
    width: "100%",
    padding: "14px 16px",
    background: focusedField === name ? "#F5F7FA" : "#FFFFFF",
    border: `1.5px solid ${focusedField === name ? "#2C6B8F" : "#E2E8F0"}`,
    borderRadius: "10px",
    fontSize: "0.95rem",
    color: "#1E2A3A",
    outline: "none",
    transition: "all 0.25s ease",
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box",
  });

  const SuccessScreen = (
    <div style={styles.successContainer}>
      <div style={styles.successIcon}>
        <div style={styles.successPulse} />
        <div style={styles.successCheck}>✓</div>
      </div>
      <h3 style={styles.successTitle}>Message Sent!</h3>
      <p style={styles.successText}>
        We've received your message and will get back to you within <strong>24 hours</strong>.
      </p>
      <div style={styles.emailBadge}>
        <span>📧</span>
        <p>Confirmation email sent to {submitStatus?.message?.replace("Confirmation email sent to ", "") || ""}</p>
      </div>
      <p style={styles.privacyNote}>🔒 Your information is safe with us</p>
    </div>
  );

  const Card = (
    <div style={inline ? styles.cardInline : styles.cardModal}>
      <div style={styles.topBar} />

      {emailSent ? (
        SuccessScreen
      ) : (
        <>
          <div style={styles.header}>
            <div>
              <h3 style={styles.title}>Get In Touch</h3>
              <p style={styles.subtitle}>We respond within 24 hours</p>
            </div>
            {!inline && (
              <button style={styles.closeBtn} onClick={onClose}>
                ✕
              </button>
            )}
          </div>

          <div style={styles.divider} />

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                style={fieldStyle("name")}
                placeholder="John Doe"
                disabled={isSubmitting}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                style={fieldStyle("email")}
                placeholder="john@example.com"
                disabled={isSubmitting}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                style={{ ...fieldStyle("message"), minHeight: 120, resize: "vertical" }}
                placeholder="How can we help you?"
                disabled={isSubmitting}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              style={isSubmitting ? styles.submitBtnDisabled : styles.submitBtn}
            >
              {isSubmitting ? (
                <>
                  <div style={styles.spinner} />
                  Sending…
                </>
              ) : (
                <>✉ Send Message</>
              )}
            </button>
            {submitStatus && submitStatus.type === "error" && (
              <div style={styles.errorMsg}>
                <span>⚠</span> {submitStatus.message}
              </div>
            )}
          </form>

          <div style={styles.privacyFooter}>
            <span>🔒</span> Your information is safe with us
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        .contact-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(44,107,143,0.35) !important; }
        .contact-submit:active { transform: translateY(0); }
        .contact-close:hover { background: rgba(44,107,143,0.1) !important; color: #2C6B8F !important; }
      `}</style>
      {inline ? (
        Card
      ) : (
        !isOpen ? null : (
          <div
            onClick={emailSent ? undefined : onClose}
            style={styles.modalOverlay}
          >
            <div onClick={(e) => e.stopPropagation()} style={styles.modalContainer}>
              {Card}
            </div>
          </div>
        )
      )}
    </>
  );
};

const styles = {
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(30,42,58,0.85)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    transition: "opacity 0.3s ease",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 480,
  },
  cardModal: {
    background: "#FFFFFF",
    borderRadius: "20px",
    overflow: "hidden",
    fontFamily: "'DM Sans', sans-serif",
    width: "100%",
    boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
    animation: "contactSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
  },
  cardInline: {
    background: "#FFFFFF",
    borderRadius: "20px",
    overflow: "hidden",
    fontFamily: "'DM Sans', sans-serif",
    width: "100%",
    boxShadow: "0 20px 60px rgba(30,42,58,0.12)",
  },
  topBar: {
    height: 4,
    background: "linear-gradient(90deg, #2C6B8F, #C9A53A)",
    backgroundSize: "200% auto",
    animation: "shimmer 3s linear infinite",
  },
  header: {
    padding: "28px 32px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: 700,
    fontFamily: "'Playfair Display', serif",
    color: "#1E2A3A",
    lineHeight: 1.2,
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#4A5568",
    fontSize: "0.85rem",
  },
  closeBtn: {
    background: "transparent",
    border: "1px solid #E2E8F0",
    borderRadius: "8px",
    color: "#4A5568",
    width: 36,
    height: 36,
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    flexShrink: 0,
    marginTop: 4,
  },
  divider: {
    margin: "20px 32px 0",
    height: 1,
    background: "#E2E8F0",
  },
  form: {
    padding: "24px 32px 32px",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    marginBottom: 7,
    color: "#1E2A3A",
    fontSize: "0.8rem",
    fontWeight: 600,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
  },
  submitBtn: {
    width: "100%",
    padding: "15px",
    background: "linear-gradient(135deg, #2C6B8F, #1E2A3A)",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.5px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 6px 20px rgba(44,107,143,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitBtnDisabled: {
    width: "100%",
    padding: "15px",
    background: "#A0AEC0",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "not-allowed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  errorMsg: {
    marginTop: 16,
    padding: "13px 16px",
    borderRadius: "10px",
    fontSize: "0.88rem",
    fontWeight: 500,
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    background: "#FED7D7",
    color: "#9B2C2C",
    border: "1px solid rgba(155,44,44,0.25)",
  },
  privacyFooter: {
    padding: "0 32px 24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    color: "#A0AEC0",
    fontSize: "0.78rem",
  },
  successContainer: {
    padding: "40px 32px 44px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  successIcon: {
    position: "relative",
    width: 72,
    height: 72,
    marginBottom: 24,
  },
  successPulse: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    background: "rgba(44,107,143,0.12)",
    border: "2px solid rgba(44,107,143,0.3)",
    animation: "pulseRing 1.8s ease-out infinite",
  },
  successCheck: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2C6B8F, #1E2A3A)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.8rem",
    color: "#FFFFFF",
    position: "relative",
  },
  successTitle: {
    margin: "0 0 10px",
    fontSize: "1.5rem",
    fontWeight: 700,
    fontFamily: "'Playfair Display', serif",
    color: "#1E2A3A",
  },
  successText: {
    margin: "0 0 6px",
    fontSize: "0.9rem",
    color: "#4A5568",
    lineHeight: 1.6,
  },
  emailBadge: {
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#F5F7FA",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "10px 16px",
    maxWidth: "100%",
    wordBreak: "break-all",
  },
  privacyNote: {
    margin: "18px 0 0",
    fontSize: "0.78rem",
    color: "#A0AEC0",
  },
  spinner: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #FFFFFF",
    animation: "spin 0.7s linear infinite",
  },
};

export default ContactFormModal;