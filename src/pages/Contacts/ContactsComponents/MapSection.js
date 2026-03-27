// ContactsComponents/MapSection.jsx
import React from "react";

const MapSection = () => {
  return (
    <section style={styles.section}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <p style={styles.eyebrow}>📍 &nbsp; Our Location</p>
          <h2 style={styles.heading}>Come Find Us</h2>
          <p style={styles.sub}>
            Based in Johannesburg — serving clients nationwide across South Africa.
          </p>
        </div>

        {/* Map card */}
        <div style={styles.mapCard}>
          {/* Top accent */}
          <div style={styles.mapAccent} />

          <iframe
            title="Office Location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=27.9,- 26.3,28.2,-26.1&layer=mapnik"
            width="100%"
            height="420"
            style={styles.iframe}
            allowFullScreen=""
            loading="lazy"
          />

          {/* Overlay label */}
          <div style={styles.mapLabel}>
            <span style={styles.mapPin}>📍</span>
            <div>
              <p style={styles.mapLabelTitle}>Muji Consulting</p>
              <p style={styles.mapLabelSub}>Johannesburg, South Africa</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    background: '#F2F2EE',
    padding: '80px 40px',
  },
  container: {
    maxWidth: 1000,
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: 48,
  },
  eyebrow: {
    color: '#C9A53A',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  heading: {
    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
    fontWeight: 800,
    color: '#1B3D2F',
    marginBottom: 14,
  },
  sub: {
    color: '#6b7280',
    fontSize: '1rem',
    lineHeight: 1.7,
    maxWidth: 480,
    margin: '0 auto',
  },
  mapCard: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(27,61,47,0.15)',
    border: '2px solid rgba(27,61,47,0.08)',
  },
  mapAccent: {
    height: 4,
    background: 'linear-gradient(90deg, #1B3D2F, #3DBE5C, #C9A53A)',
    position: 'relative',
    zIndex: 2,
  },
  iframe: {
    display: 'block',
    border: 0,
    width: '100%',
  },
  mapLabel: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    background: '#1B3D2F',
    borderRadius: 12,
    padding: '12px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
  },
  mapPin: {
    fontSize: '1.4rem',
  },
  mapLabelTitle: {
    color: '#F2F2EE',
    fontWeight: 700,
    fontSize: '0.9rem',
    margin: 0,
  },
  mapLabelSub: {
    color: '#C9A53A',
    fontSize: '0.78rem',
    margin: 0,
  },
};

export default MapSection;