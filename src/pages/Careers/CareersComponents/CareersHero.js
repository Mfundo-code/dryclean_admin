// src/Components/CareersHero.js
import React from "react";

/*
  Logo palette:
  --dark-green  : #1B3D2F
  --bright-green: #3DBE5C
  --gold        : #C9A53A
  --dark        : #1C1C1C
  --light-gray  : #F2F2EE
*/

const CareersHero = () => {
  return (
    <section className="careers-hero">
      <div className="hero-overlay"></div>
      <div className="hero-container">
        <span className="hero-preheadline">Careers at Muji</span>
        <h1 className="hero-headline">
          Be Part of a Team That Connects{" "}
          <span className="hero-accent">Talent</span> to{" "}
          <span className="hero-accent">Opportunity</span>
        </h1>
        <p className="hero-subheadline">
          Join a dynamic team of recruitment professionals dedicated to
          Engineering, Construction, Mining, FMCG, Architecture, Supply Chain,
          and Logistics. Help us build lasting partnerships and deliver
          exceptional talent solutions.
        </p>
        <div className="hero-cta-group">
          <a href="#open-positions" className="hero-cta-primary">
            Explore Opportunities
            <span className="hero-arrow">→</span>
          </a>
        </div>
      </div>
      <div className="hero-bottom-accent"></div>

      <style jsx>{`
        .careers-hero {
          position: relative;
          background-image: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(27,61,47,0.92) 0%, rgba(10,30,18,0.88) 100%);
          z-index: 1;
        }
        .hero-container {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px 2px 5px; /* reduced from 120px 20px 80px to half */
          text-align: center;
          color: #F2F2EE;
        }
        .hero-preheadline {
          display: inline-block;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #C9A53A;
          margin-bottom: 1rem;
          border-left: 3px solid #C9A53A;
          padding-left: 12px;
        }
        .hero-headline {
          font-size: clamp(36px, 6vw, 56px);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 24px;
          color: #F2F2EE;
        }
        .hero-accent {
          color: #3DBE5C;
          border-bottom: 3px solid #C9A53A;
          display: inline-block;
          padding-bottom: 4px;
        }
        .hero-subheadline {
          font-size: clamp(16px, 2vw, 20px);
          color: #c8d5c8;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 40px;
        }
        .hero-cta-group {
          display: flex;
          justify-content: center;
        }
        .hero-cta-primary {
          background: #C9A53A;
          border: none;
          border-radius: 4px;
          padding: 16px 36px;
          color: #1B3D2F;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 10px 20px rgba(201,165,58,0.3);
          text-decoration: none;
        }
        .hero-cta-primary:hover {
          background: #3DBE5C;
          transform: translateY(-2px);
          box-shadow: 0 15px 25px rgba(61,190,92,0.4);
          color: #1B3D2F;
        }
        .hero-arrow {
          font-size: 20px;
          line-height: 1;
        }
        .hero-bottom-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, #C9A53A, transparent);
          z-index: 2;
        }
        @media (max-width: 768px) {
          .hero-container {
            padding: 50px 20px 30px; /* reduced from 100px 20px 60px to half */
          }
          .hero-headline {
            font-size: 2.5rem;
          }
        }
        @media (max-width: 480px) {
          .hero-headline {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default CareersHero;