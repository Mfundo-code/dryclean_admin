// src/Components/TestimonialsSection.js
import React, { useState, useEffect } from "react";

/*
  Logo palette:
  --dark-green  : #1B3D2F
  --bright-green: #3DBE5C
  --gold        : #C9A53A
  --dark        : #1C1C1C
  --light-gray  : #F2F2EE
*/

const GOLD         = "#C9A53A";
const BRIGHT_GREEN = "#3DBE5C";
const DARK_GREEN   = "#1B3D2F";
const OFF_WHITE    = "#F2F2EE";

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Ndlovu",
      location: "Johannesburg",
      rating: 5,
      text: "Muji’s team understood exactly what I was looking for in a civil engineering role. They found me a position that matched both my technical skills and the company’s culture. The process was seamless and genuinely supportive.",
      service: "Permanent Placement"
    },
    {
      id: 2,
      name: "Thabo Mokoena",
      location: "Cape Town",
      rating: 5,
      text: "We needed a senior geologist for a mining project—a niche role that’s hard to fill. Within days, Muji presented three highly qualified candidates. Their industry knowledge saved us months of searching.",
      service: "Executive Search"
    },
    {
      id: 3,
      name: "Priya Singh",
      location: "Durban",
      rating: 5,
      text: "I was impressed by how Muji took the time to understand my background in logistics. They didn’t just send my CV everywhere; they curated opportunities that fit my career goals. I’m now thriving in a role I love.",
      service: "Supply Chain Recruitment"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const StarRating = ({ rating }) => (
    <div style={styles.starRating}>
      {[...Array(5)].map((_, index) => (
        <span key={index} style={index < rating ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
    </div>
  );

  return (
    <section style={styles.container}>
      <style>{`
        .t-nav-btn:hover {
          background: ${GOLD} !important;
          color: ${DARK_GREEN} !important;
          transform: scale(1.05);
        }
        .t-dot:hover {
          background: ${GOLD} !important;
          transform: scale(1.2);
        }
        .t-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(27,61,47,0.35) !important;
          border-color: rgba(201,165,58,0.3) !important;
        }
      `}</style>

      <div style={styles.header}>
        <h2 style={styles.title}>What Our Customers Say</h2>
        <p style={styles.subtitle}>
          Real feedback from satisfied candidates and clients across South Africa and the industries we serve
        </p>
      </div>

      <div style={styles.carouselContainer}>
        <div style={styles.carousel}>

          {/* Testimonial Card */}
          <div className="t-card" style={styles.testimonialCard}>
            <StarRating rating={testimonials[currentTestimonial].rating} />
            <p style={styles.testimonialText}>
              "{testimonials[currentTestimonial].text}"
            </p>
            <div style={styles.customerInfo}>
              <div style={styles.customerDetails}>
                <h4 style={styles.customerName}>{testimonials[currentTestimonial].name}</h4>
                <p style={styles.customerLocation}>{testimonials[currentTestimonial].location}</p>
                <div style={styles.serviceBadge}>
                  {testimonials[currentTestimonial].service}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={styles.navigation}>
            <button className="t-nav-btn" style={styles.navButton} onClick={prevTestimonial}>
              ‹
            </button>

            <div style={styles.dots}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className="t-dot"
                  style={{
                    ...styles.dot,
                    background: index === currentTestimonial ? GOLD : "rgba(27,61,47,0.25)",
                  }}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>

            <button className="t-nav-btn" style={styles.navButton} onClick={nextTestimonial}>
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

const styles = {
  container: {
    padding: "3rem 1rem",
    background: "transparent",
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: DARK_GREEN,
    margin: "0 0 1rem 0",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: DARK_GREEN,
    maxWidth: "500px",
    margin: "0 auto",
    lineHeight: 1.5,
    opacity: 0.75,
  },
  carouselContainer: {
    maxWidth: "500px",
    margin: "0 auto 2rem",
  },
  carousel: {
    position: "relative",
  },
  testimonialCard: {
    background: "linear-gradient(180deg, rgba(27,61,47,0.90), rgba(10,30,18,0.88))",
    border: "1px solid rgba(201,165,58,0.12)",
    borderRadius: "16px",
    padding: "1.5rem",
    backdropFilter: "blur(8px)",
    boxShadow: "0 4px 16px rgba(27,61,47,0.25)",
    textAlign: "center",
    marginBottom: "1.5rem",
    transition: "all 0.25s ease",
  },
  starRating: {
    marginBottom: "1rem",
  },
  starFilled: {
    color: GOLD,
    fontSize: "1.2rem",
    margin: "0 2px",
    opacity: 1,
  },
  starEmpty: {
    color: "rgba(201,165,58,0.25)",
    fontSize: "1.2rem",
    margin: "0 2px",
  },
  testimonialText: {
    fontSize: "1rem",
    lineHeight: 1.6,
    color: "#e8ede8",
    margin: "0 0 1.5rem 0",
    fontStyle: "italic",
  },
  customerInfo: {
    display: "flex",
    justifyContent: "center",
  },
  customerDetails: {
    textAlign: "center",
  },
  customerName: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: OFF_WHITE,
    margin: "0 0 0.2rem 0",
  },
  customerLocation: {
    color: "#c8d5c8",
    margin: "0 0 0.5rem 0",
    fontSize: "0.9rem",
  },
  serviceBadge: {
    background: "rgba(61,190,92,0.12)",
    color: BRIGHT_GREEN,
    padding: "0.3rem 0.8rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
    display: "inline-block",
    border: "1px solid rgba(61,190,92,0.25)",
  },
  navigation: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1rem",
  },
  navButton: {
    background: "transparent",
    border: `2px solid ${GOLD}`,
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "1.2rem",
    color: GOLD,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  dots: {
    display: "flex",
    gap: "0.5rem",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};