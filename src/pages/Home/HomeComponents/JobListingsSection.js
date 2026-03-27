// src/Components/JobListingsSection.js
import React, { useState, useEffect } from "react";

/*
  Logo palette:
  --dark-green  : #1B3D2F
  --bright-green: #3DBE5C
  --gold        : #C9A53A
  --dark        : #1C1C1C
  --light-gray  : #F2F2EE
*/

const rotatingPhrases = [
  "The Right Talent",
  "The Right Opportunity",
  "Long‑Term Success",
  "Industry Expertise",
  "Trusted Partnerships",
];

const perks = [
  "Access to Leading Companies",
  "Personalized Career Guidance",
  "Confidential Search Process",
  "Industry Specialists",
  "Rapid Placement",
  "Long‑Term Career Success",
];

const JobListingsSection = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [btnHovered, setBtnHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % rotatingPhrases.length);
        setVisible(true);
      }, 400);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="jl-section">
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.9; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes word-pop {
          0%   { opacity: 0; transform: translateY(12px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .jl-section {
          position: relative;
          background-image: url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80");
          background-size: cover;
          background-position: center top;
          padding: 72px 40px;
          overflow: hidden;
        }

        .jl-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(27,61,47,0.82) 0%, rgba(10,30,18,0.78) 100%);
          z-index: 1;
        }

        .jl-container {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 64px;
          flex-wrap: wrap;
        }

        /* Left column */
        .jl-left {
          flex: 1 1 380px;
        }
        .jl-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #C9A53A;
          opacity: 0.9;
          margin: 0 0 16px;
        }
        .jl-headline-static {
          font-size: clamp(32px, 4.5vw, 54px);
          font-weight: 800;
          color: #F2F2EE;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin: 0 0 2px;
        }
        .jl-rotating-wrap {
          display: flex;
          align-items: center;
          gap: 4px;
          min-height: 68px;
          margin-bottom: 18px;
        }
        .jl-rotating-phrase {
          font-size: clamp(32px, 4.5vw, 54px);
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1.1;
          color: #3DBE5C;
          display: inline-block;
          border-bottom: 3px solid #C9A53A;
          padding-bottom: 2px;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .jl-cursor {
          font-size: clamp(32px, 4.5vw, 54px);
          font-weight: 300;
          color: #C9A53A;
          opacity: 0.6;
          animation: glow-pulse 0.9s ease-in-out infinite;
          line-height: 1;
        }
        .jl-subcopy {
          font-size: 15px;
          color: #c8d5c8;
          line-height: 1.7;
          margin: 0 0 32px;
          max-width: 540px;
        }
        .jl-strong {
          color: #F2F2EE;
          font-weight: 700;
        }
        .jl-cta-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
        .jl-cta-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 15px 36px;
          background: #C9A53A;
          border: 2px solid #C9A53A;
          border-radius: 6px;
          color: #1B3D2F;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          letter-spacing: 0.3px;
          transition: all 0.25s ease;
          overflow: hidden;
        }
        .jl-cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(201,165,58,0.45);
        }
        .jl-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
          background-size: 400px 100%;
          animation: shimmer 0.8s ease forwards;
          pointer-events: none;
        }
        .jl-cta-note {
          margin: 0;
          font-size: 11px;
          color: rgba(242,242,238,0.35);
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        /* Right column — perks grid */
        .jl-right {
          flex: 1 1 300px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .jl-perk-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          background: rgba(27,61,47,0.45);
          border: 1px solid rgba(242,242,238,0.10);
          border-radius: 10px;
          backdrop-filter: blur(8px);
          transition: all 0.22s ease;
          cursor: default;
        }
        .jl-perk-card:hover {
          border-color: rgba(201,165,58,0.5);
          transform: translateY(-2px);
        }
        .jl-perk-card:hover .jl-perk-dot {
          background: #C9A53A;
          box-shadow: 0 0 8px rgba(201,165,58,0.6);
        }
        .jl-perk-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(201,165,58,0.6);
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .jl-perk-label-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .jl-perk-word {
          font-size: 12px;
          font-weight: 600;
          color: #e8ede8;
          line-height: 1.3;
          display: inline-block;
        }

        /* Responsive: Tablet */
        @media (max-width: 992px) {
          .jl-section {
            padding: 60px 30px;
          }
          .jl-container {
            gap: 48px;
          }
          .jl-right {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        /* Responsive: Mobile */
        @media (max-width: 768px) {
          .jl-section {
            padding: 48px 20px;
          }
          .jl-container {
            flex-direction: column;
            gap: 40px;
            text-align: center;
          }
          .jl-left {
            text-align: center;
          }
          .jl-subcopy {
            max-width: 100%;
            margin-left: auto;
            margin-right: auto;
          }
          .jl-cta-wrap {
            align-items: center;
          }
          .jl-cta-btn {
            padding: 12px 28px;
            font-size: 14px;
          }
          .jl-right {
            grid-template-columns: 1fr;
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
          }
          .jl-perk-card {
            padding: 12px 16px;
          }
          .jl-perk-word {
            font-size: 11px;
          }
        }

        /* Extra small devices */
        @media (max-width: 480px) {
          .jl-section {
            padding: 40px 16px;
          }
          .jl-headline-static,
          .jl-rotating-phrase,
          .jl-cursor {
            font-size: 28px;
          }
          .jl-rotating-wrap {
            min-height: 56px;
          }
          .jl-subcopy {
            font-size: 14px;
          }
          .jl-cta-btn {
            padding: 10px 24px;
            font-size: 13px;
          }
        }
      `}</style>

      <div className="jl-overlay" aria-hidden="true" />

      <div className="jl-container">
        {/* Left: headline + sub-copy */}
        <div className="jl-left">
          <p className="jl-eyebrow">PARTNER WITH MUJI</p>

          <h2 className="jl-headline-static">We deliver</h2>
          <div className="jl-rotating-wrap">
            <span
              className="jl-rotating-phrase"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
              }}
            >
              {rotatingPhrases[phraseIndex]}
            </span>
            <span className="jl-cursor">|</span>
          </div>

          <p className="jl-subcopy">
            With deep expertise in <strong className="jl-strong">Engineering, Construction, Mining, FMCG, Architecture, Supply Chain, and Logistics</strong>, we bridge exceptional talent with outstanding opportunities — delivering recruitment solutions that create lasting value.
          </p>

          <div className="jl-cta-wrap">
            <a
              href="/jobs"
              className="jl-cta-btn"
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
            >
              {btnHovered && <div className="jl-shimmer" aria-hidden="true" />}
              <span style={{ position: "relative", zIndex: 1 }}>Explore Opportunities</span>
              <svg
                width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{
                  position: "relative", zIndex: 1,
                  transition: "transform 0.2s ease",
                  transform: btnHovered ? "translateX(4px)" : "translateX(0)",
                }}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <p className="jl-cta-note">No sign‑up required · Get matched with your next role</p>
          </div>
        </div>

        {/* Right: perks grid */}
        <div className="jl-right">
          {perks.map((label, i) => (
            <div
              key={i}
              className="jl-perk-card"
              style={{
                animation: `fade-in 0.5s ${i * 0.12}s ease both`,
              }}
            >
              <span className="jl-perk-dot" />
              <span className="jl-perk-label-wrap">
                {label.split(" ").map((word, wi) => (
                  <span
                    key={wi}
                    className="jl-perk-word"
                    style={{
                      animation: `word-pop 0.45s ${i * 0.12 + wi * 0.07}s cubic-bezier(0.34,1.56,0.64,1) both`,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobListingsSection;