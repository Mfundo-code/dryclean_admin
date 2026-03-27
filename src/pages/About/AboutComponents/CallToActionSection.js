// src/Components/CallToActionSection.js (candidate-focused version)
import React from "react";
import { Link } from "react-router-dom";

/*
  Logo palette:
  --dark-green  : #1B3D2F
  --bright-green: #3DBE5C
  --gold        : #C9A53A
  --dark        : #1C1C1C
  --light-gray  : #F2F2EE
*/

const CallToActionSection = () => {
  return (
    <section className="cta-container">
      <div className="cta-overlay"></div>
      <div className="cta-content">
        {/* Left section - Text content */}
        <div className="cta-text-section">
          <h2 className="cta-title">Ready for Your Next Career Opportunity?</h2>
          <p className="cta-description">
            With deep expertise in Engineering, Construction, Mining, FMCG,
            Architecture, Supply Chain, and Logistics, we connect you with roles
            that align with your skills and aspirations. Whether you're an
            experienced professional or just starting out, let us help you find
            the opportunity where you’ll truly thrive.
          </p>
        </div>

        <div className="cta-spacer"></div>

        {/* Right section - Vacancies button */}
        <div className="cta-contact-section">
          <Link to="/careers" className="cta-vacancies-wrapper">
            <div className="cta-vacancies-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 7h-4.5A2.5 2.5 0 0 0 13 9.5v5A2.5 2.5 0 0 0 15.5 17h4.5" />
                <path d="M4 7h4.5A2.5 2.5 0 0 1 11 9.5v5A2.5 2.5 0 0 1 8.5 17H4" />
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                <line x1="8" y1="2" x2="8" y2="4" />
                <line x1="16" y1="2" x2="16" y2="4" />
              </svg>
            </div>
            <div className="cta-vacancies-content">
              <div className="cta-view-text">Browse Available Roles</div>
              <div className="cta-vacancies-label">View Openings</div>
            </div>
          </Link>
        </div>
      </div>

      <div className="cta-bottom-accent"></div>

      <style jsx>{`
        .cta-container {
          position: relative;
          padding: 5rem 2rem;
          background-image: url('https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          color: #F2F2EE;
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        }

        .cta-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(27,61,47,0.90) 0%, rgba(10,30,18,0.85) 100%);
          z-index: 1;
        }

        .cta-content {
          position: relative;
          z-index: 2;
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
          color: #F2F2EE;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .cta-description {
          font-size: 1.2rem;
          line-height: 1.6;
          opacity: 0.92;
          margin: 0;
          color: #c8d5c8;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .cta-vacancies-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 2rem;
          background: rgba(201,165,58,0.10);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 2px solid #C9A53A;
          color: #F2F2EE;
          box-shadow: 0 8px 25px rgba(201,165,58,0.15);
          transition: all 0.3s ease;
          cursor: pointer;
          width: 100%;
          text-align: left;
          outline: none;
          text-decoration: none;
        }

        .cta-vacancies-wrapper:hover {
          transform: translateY(-2px);
          background: rgba(201,165,58,0.18);
          border-color: #C9A53A;
          box-shadow: 0 12px 30px rgba(201,165,58,0.28);
        }

        .cta-vacancies-wrapper:active {
          transform: translateY(0);
        }

        .cta-vacancies-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(201,165,58,0.18);
          border-radius: 50%;
          color: #C9A53A;
          flex-shrink: 0;
        }

        .cta-vacancies-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .cta-view-text {
          font-size: 0.9rem;
          color: #c8d5c8;
          font-weight: 500;
        }

        .cta-vacancies-label {
          font-size: 1.4rem;
          font-weight: bold;
          color: #C9A53A;
          letter-spacing: 0.5px;
        }

        .cta-bottom-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, #C9A53A, transparent);
          z-index: 2;
        }

        @media (max-width: 768px) {
          .cta-container {
            padding: 3rem 1rem;
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
            font-size: 2.2rem;
            text-align: center;
          }
          .cta-description {
            font-size: 1.1rem;
            text-align: center;
            padding: 0 1rem;
          }
          .cta-spacer {
            display: none;
          }
          .cta-vacancies-wrapper {
            flex-direction: column;
            text-align: center;
            padding: 1.5rem;
            margin: 0 auto;
            justify-content: center;
          }
          .cta-vacancies-content {
            align-items: center;
          }
          .cta-vacancies-label {
            font-size: 1.3rem;
          }
        }

        @media (max-width: 480px) {
          .cta-title {
            font-size: 1.8rem;
          }
          .cta-description {
            font-size: 1rem;
          }
          .cta-vacancies-wrapper {
            padding: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
};

export default CallToActionSection;