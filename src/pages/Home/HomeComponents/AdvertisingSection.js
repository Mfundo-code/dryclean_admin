// src/Components/AdvertisingSection.js
import React from "react";
import { FaTrophy, FaLeaf, FaSmile } from "react-icons/fa";

const AdvertisingSection = () => {
  const cards = [
    {
      id: 1,
      icon: <FaTrophy className="ad-icon ad-icon-gold" />,
      title: "Expert Garment Care",
      description:
        "Our experienced team handles delicate fabrics with precision, ensuring your clothes look their best every time.",
    },
    {
      id: 2,
      icon: <FaLeaf className="ad-icon ad-icon-blue" />,
      title: "Eco‑Friendly Cleaning",
      description:
        "We use environmentally safe solvents and methods that are tough on stains but gentle on the planet.",
    },
    {
      id: 3,
      icon: <FaSmile className="ad-icon ad-icon-gold" />,
      title: "100% Satisfaction Guaranteed",
      description:
        "We stand behind our work – if you're not happy, we'll make it right. Your trust is our priority.",
    },
  ];

  return (
    <section className="ad-section">
      <div className="ad-container">
        <div className="ad-card-grid">
          {cards.map((card) => (
            <article key={card.id} className="ad-card">
              <div className="ad-card-icon">{card.icon}</div>
              <h3 className="ad-card-title">{card.title}</h3>
              <p className="ad-card-desc">{card.description}</p>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* Base styles */
        .ad-section {
          position: relative;
          z-index: 10;
          margin-top: -50px;
          margin-bottom: -50px;
        }

        .ad-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .ad-card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .ad-card {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 28px 24px;
          box-shadow: 0 12px 32px rgba(30, 42, 58, 0.1);
          border-top: 4px solid #C9A53A;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }

        .ad-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(30, 42, 58, 0.15);
        }

        .ad-card-icon {
          margin-bottom: 16px;
        }

        .ad-icon {
          font-size: 32px;
        }

        .ad-icon-gold {
          color: #C9A53A;
        }

        .ad-icon-blue {
          color: #2C6B8F;
        }

        .ad-card-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #1E2A3A; /* navy */
        }

        .ad-card-desc {
          font-size: 15px;
          color: #4A5568; /* gray */
          line-height: 1.5;
        }

        /* Tablet (max-width: 992px) */
        @media (max-width: 992px) {
          .ad-card-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .ad-card {
            padding: 24px 20px;
          }
          .ad-card-title {
            font-size: 18px;
          }
          .ad-card-desc {
            font-size: 14px;
          }
        }

        /* Mobile (max-width: 576px) */
        @media (max-width: 576px) {
          .ad-section {
            margin-top: -30px;
            margin-bottom: -30px;
          }
          .ad-card-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .ad-card {
            padding: 20px 16px;
          }
          .ad-icon {
            font-size: 28px;
          }
          .ad-card-title {
            font-size: 16px;
          }
          .ad-card-desc {
            font-size: 13px;
          }
        }
      `}</style>
    </section>
  );
};

export default AdvertisingSection;