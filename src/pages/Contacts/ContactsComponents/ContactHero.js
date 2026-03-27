// ContactsComponents/ContactHero.jsx
import React from "react";

const ContactHero = () => {
  return (
    <section style={styles.section}>
      {/* Background grid pattern */}
      <div style={styles.gridPattern}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(201,165,58,0.08)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glow blobs */}
      <div style={{ ...styles.blob, top: '-80px', left: '-80px', background: 'radial-gradient(circle, rgba(61,190,92,0.12) 0%, transparent 65%)' }} />
      <div style={{ ...styles.blob, bottom: '-60px', right: '-60px', background: 'radial-gradient(circle, rgba(201,165,58,0.10) 0%, transparent 65%)' }} />

      <div style={styles.inner}>
        <p style={styles.eyebrow}>✦ &nbsp; Get In Touch &nbsp; ✦</p>

        <h1 style={styles.headline}>
          Let's Start a <br />
          <span style={styles.accent}>Conversation</span>
        </h1>

        <p style={styles.sub}>
          Have a project in mind or just want to say hello? We'd love to hear
          from you. Our team is ready to help bring your vision to life.
        </p>

        <div style={styles.dots}>
          <span style={styles.dot} />
          <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
          <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.3); }
        }
        .contact-dot { animation: dotPulse 1.6s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

const styles = {
  section: {
    position: 'relative',
    background: 'linear-gradient(135deg, #0a1a10 0%, #1B3D2F 60%, #163324 100%)',
    padding: '100px 40px 110px',
    overflow: 'hidden',
    textAlign: 'center',
  },
  gridPattern: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  blob: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 720,
    margin: '0 auto',
  },
  eyebrow: {
    color: '#C9A53A',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  headline: {
    fontSize: 'clamp(2.6rem, 6vw, 5rem)',
    fontWeight: 800,
    color: '#F2F2EE',
    lineHeight: 1.1,
    marginBottom: 24,
  },
  accent: {
    color: '#3DBE5C',
    borderBottom: '3px solid #C9A53A',
    display: 'inline-block',
    paddingBottom: 4,
  },
  sub: {
    fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
    color: 'rgba(242,242,238,0.55)',
    lineHeight: 1.8,
    maxWidth: 540,
    margin: '0 auto 40px',
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    display: 'inline-block',
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#C9A53A',
    animation: 'dotPulse 1.6s ease-in-out infinite',
  },
};

export default ContactHero;