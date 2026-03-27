// src/pages/Home/HomeComponents/CallToActionSection.js
import React, { useState } from "react";
import ContactFormModal from "../../../GlobalComponents/ContactFormModal";

const CallToActionSection = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  return (
    <>
      <section className="cta-container">
        <div className="cta-content">
          <div className="cta-text-section">
            <h2 className="cta-title">Need Your Clothes Looking Their Best?</h2>
            <p className="cta-description">
              From everyday wear to delicate fabrics, we provide expert dry cleaning
              and laundry services that leave your garments fresh, crisp, and perfectly
              pressed. Place your order online and we'll take care of the rest.
            </p>
          </div>

          <div className="cta-spacer"></div>

          <div className="cta-contact-section">
            <button
              className="cta-order-wrapper"
              onClick={() => setIsContactFormOpen(true)}
              aria-label="Place an order"
            >
              <div className="cta-order-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 7h-4.18A3 3 0 0 0 13 4h-2a3 3 0 0 0-2.82 3H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                  <line x1="12" y1="12" x2="12" y2="18" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <div className="cta-order-content">
                <div className="cta-order-text">Place an Order</div>
                <div className="cta-order-subtext">Quick & Easy</div>
              </div>
            </button>
          </div>
        </div>

        <style jsx>{`
          .cta-container {
            padding: 100px 2rem 5rem;
            background: linear-gradient(135deg, #1E2A3A 0%, #0F1923 100%);
            color: #FFFFFF;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            position: relative;
            z-index: 1;
          }

          .cta-container::before {
            content: "";
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            background: #C9A53A;
            border-radius: 2px;
          }

          .cta-content {
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
            color: #FFFFFF;
            line-height: 1.2;
          }

          .cta-description {
            font-size: 1.15rem;
            line-height: 1.7;
            margin: 0;
            color: #F5F7FA;
            opacity: 0.9;
          }

          .cta-order-wrapper {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem 2rem;
            background: rgba(201, 165, 58, 0.08);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            border: 2px solid #C9A53A;
            color: #FFFFFF;
            box-shadow: 0 0 24px rgba(201, 165, 58, 0.15);
            transition: all 0.3s ease;
            cursor: pointer;
            width: 100%;
            text-align: left;
            outline: none;
          }

          .cta-order-wrapper:hover {
            transform: translateY(-2px);
            background: rgba(201, 165, 58, 0.15);
            box-shadow: 0 0 36px rgba(201, 165, 58, 0.28);
          }

          .cta-order-wrapper:active {
            transform: translateY(0);
          }

          .cta-order-icon {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(201, 165, 58, 0.15);
            border-radius: 50%;
            color: #C9A53A;
            flex-shrink: 0;
          }

          .cta-order-content {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .cta-order-text {
            font-size: 1.2rem;
            font-weight: 700;
            color: #C9A53A;
          }

          .cta-order-subtext {
            font-size: 0.8rem;
            color: #F5F7FA;
            opacity: 0.8;
          }

          @media (max-width: 768px) {
            .cta-container {
              padding: 90px 1rem 3rem;
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
              font-size: 2rem;
            }

            .cta-description {
              font-size: 1.05rem;
              padding: 0 1rem;
            }

            .cta-spacer {
              display: none;
            }

            .cta-order-wrapper {
              flex-direction: column;
              text-align: center;
              padding: 1.5rem;
              margin: 0 auto;
              justify-content: center;
            }

            .cta-order-content {
              align-items: center;
            }

            .cta-order-text {
              font-size: 1.1rem;
            }
          }

          @media (max-width: 480px) {
            .cta-title {
              font-size: 1.8rem;
            }

            .cta-description {
              font-size: 1rem;
            }

            .cta-order-wrapper {
              padding: 1.25rem;
            }
          }
        `}</style>
      </section>

      <ContactFormModal
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
    </>
  );
};

export default CallToActionSection;