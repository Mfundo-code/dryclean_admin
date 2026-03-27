// ContactsComponents/ContactCTA.jsx
import React, { useState } from "react";

const ContactCTA = () => {
  const [hoverSchedule, setHoverSchedule] = useState(false);
  const [hoverPricing,  setHoverPricing]  = useState(false);

  return (
    <section style={styles.section}>
      {/* Dot pattern */}
      <div style={styles.dotsOverlay}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ctaDots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="1.5" fill="rgba(201,165,58,0.18)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ctaDots)" />
        </svg>
      </div>

      {/* Glow */}
      <div style={styles.glow} />

      <div style={styles.inner}>
        <p style={styles.eyebrow}>✦ &nbsp; Next Step &nbsp; ✦</p>

        <h2 style={styles.heading}>
          Ready to Find Your<br />
          <span style={styles.accent}>Perfect Hire?</span>
        </h2>

        <p style={styles.sub}>
          Let's collaborate and build a team that drives real results.
          Get a free, no-commitment consultation with our recruiters today.
        </p>

        <div style={styles.btnRow}>
          <button
            style={{
              ...styles.btnPrimary,
              ...(hoverSchedule ? styles.btnPrimaryHover : {}),
            }}
            onMouseEnter={() => setHoverSchedule(true)}
            onMouseLeave={() => setHoverSchedule(false)}
          >
            📞 &nbsp; Schedule a Call
          </button>

          <button
            style={{
              ...styles.btnOutline,
              ...(hoverPricing ? styles.btnOutlineHover : {}),
            }}
            onMouseEnter={() => setHoverPricing(true)}
            onMouseLeave={() => setHoverPricing(false)}
          >
            View Our Services
          </button>
        </div>

        <p style={styles.note}>
          * No commitment — free consultation for new clients
        </p>
      </div>
    </section>
  );
};

const styles = {
  section: {
    position: 'relative',
    background: 'linear-gradient(135deg, #0a1a10 0%, #1B3D2F 60%, #0f2218 100%)',
    padding: '90px 40px',
    overflow: 'hidden',
    textAlign: 'center',
  },
  dotsOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  glow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 600,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(61,190,92,0.08) 0%, transparent 65%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 680,
    margin: '0 auto',
  },
  eyebrow: {
    color: '#C9A53A',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  heading: {
    fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
    fontWeight: 800,
    color: '#F2F2EE',
    lineHeight: 1.15,
    marginBottom: 22,
  },
  accent: {
    color: '#3DBE5C',
    borderBottom: '3px solid #C9A53A',
    display: 'inline-block',
    paddingBottom: 4,
  },
  sub: {
    color: 'rgba(242,242,238,0.55)',
    fontSize: 'clamp(0.95rem, 1.6vw, 1.08rem)',
    lineHeight: 1.8,
    marginBottom: 40,
    maxWidth: 520,
    margin: '0 auto 40px',
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  btnPrimary: {
    background: '#C9A53A',
    color: '#1B3D2F',
    border: '2px solid #C9A53A',
    borderRadius: 8,
    padding: '14px 32px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.3px',
  },
  btnPrimaryHover: {
    background: '#e8c96a',
    borderColor: '#e8c96a',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 28px rgba(201,165,58,0.35)',
  },
  btnOutline: {
    background: 'transparent',
    color: '#F2F2EE',
    border: '2px solid rgba(242,242,238,0.3)',
    borderRadius: 8,
    padding: '14px 32px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  btnOutlineHover: {
    background: 'rgba(242,242,238,0.08)',
    borderColor: '#F2F2EE',
    transform: 'translateY(-2px)',
  },
  note: {
    color: 'rgba(242,242,238,0.25)',
    fontSize: '0.82rem',
    marginTop: 8,
  },
};

export default ContactCTA;