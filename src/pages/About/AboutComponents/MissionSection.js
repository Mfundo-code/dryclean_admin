// src/Components/MissionSection.js
import React from "react";

/*
  Logo palette:
  --dark-green  : #1B3D2F
  --bright-green: #3DBE5C
  --gold        : #C9A53A
  --dark        : #1C1C1C
  --light-gray  : #F2F2EE
*/

const MissionSection = () => {
  return (
    <section className="mission-section">
      <div className="mission-container">
        <div className="mission-content">
          <span className="mission-tag">Our Mission</span>
          <h2 className="mission-heading">
            Aligning the Right Talent with The Right Opportunities
          </h2>
          <p className="mission-paragraph">
            Our mission is clear: to align the right talent with the right
            opportunities. We go beyond matching resumes to job descriptions —
            we focus on finding candidates who possess not only the required
            skills but also the cultural fit that drives long‑term success. With
            deep expertise in Engineering, Construction, Mining, FMCG,
            Architecture, Supply Chain, and Logistics, we build partnerships
            that create lasting value.
          </p>
        </div>
        <div className="mission-image-container">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Team collaboration"
            className="mission-image"
          />
        </div>
      </div>

      <style jsx>{`
        .mission-section {
          padding: 80px 5%;
          background-color: #F2F2EE;
        }

        .mission-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .mission-content {
          max-width: 500px;
        }

        .mission-tag {
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

        .mission-heading {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          color: #1B3D2F;
          margin-bottom: 24px;
          line-height: 1.2;
        }

        .mission-paragraph {
          font-size: 1.1rem;
          color: #2e4a38;
          line-height: 1.8;
          margin-bottom: 0;
        }

        .mission-image-container {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(27,61,47,0.15);
        }

        .mission-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Tablet (max-width: 992px) */
        @media (max-width: 992px) {
          .mission-section {
            padding: 60px 5%;
          }
          .mission-container {
            gap: 40px;
          }
          .mission-content {
            max-width: 100%;
          }
          .mission-paragraph {
            font-size: 1rem;
          }
        }

        /* Mobile (max-width: 768px) */
        @media (max-width: 768px) {
          .mission-section {
            padding: 48px 5%;
          }
          .mission-container {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
          }
          .mission-content {
            text-align: center;
            max-width: 100%;
          }
          .mission-tag {
            margin-left: auto;
            margin-right: auto;
            text-align: left;
          }
          .mission-heading {
            font-size: clamp(26px, 5vw, 36px);
            margin-bottom: 20px;
          }
          .mission-paragraph {
            font-size: 1rem;
            line-height: 1.7;
          }
          .mission-image-container {
            max-width: 100%;
            margin-top: 0;
          }
        }

        /* Extra small devices (max-width: 480px) */
        @media (max-width: 480px) {
          .mission-section {
            padding: 40px 4%;
          }
          .mission-heading {
            font-size: 24px;
            margin-bottom: 16px;
          }
          .mission-paragraph {
            font-size: 0.95rem;
            line-height: 1.6;
          }
          .mission-container {
            gap: 24px;
          }
        }
      `}</style>
    </section>
  );
};

export default MissionSection;