import React from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";
import LogoB from "../assets/images/LogoB.png";

const Footer = () => {
  return (
    <footer className="footer" style={styles.footer}>
      <div style={styles.container}>
        {/* Main footer content */}
        <div style={styles.mainContent}>
          {/* Column 1: Company Info */}
          <div className="footer-column" style={styles.column}>
            <img
              src={LogoB}
              alt="Lebowakgomo Dry Cleaners"
              style={styles.logo}
            />
            <p style={styles.tagline}>
              Professional dry cleaning and laundry services in Lebowakgomo.
              Quality care for your garments with a commitment to freshness and
              reliability.
            </p>
          </div>

          {/* Column 2: Services */}
          <div className="footer-column" style={styles.column}>
            <h4 style={styles.columnTitle}>Services</h4>
            <ul style={styles.linkList}>
              <li>
                <Link to="/services" style={styles.link}>
                  Dry Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services" style={styles.link}>
                  Wash & Fold
                </Link>
              </li>
              <li>
                <Link to="/services" style={styles.link}>
                  Ironing & Pressing
                </Link>
              </li>
              <li>
                <Link to="/services" style={styles.link}>
                  Stain Removal
                </Link>
              </li>
              <li>
                <Link to="/services" style={styles.link}>
                  Wedding Gown Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="footer-column" style={styles.column}>
            <h4 style={styles.columnTitle}>Quick Links</h4>
            <ul style={styles.linkList}>
              <li>
                <Link to="/" style={styles.link}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" style={styles.link}>
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/track" style={styles.link}>
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/contact" style={styles.link}>
                  Contact
                </Link>
              </li>
              {/* About Us link removed */}
              <li>
                <Link to="/admin/login" style={styles.link}>
                  Sign in
                  <FaArrowRight style={styles.arrowIcon} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours */}
          <div className="footer-column" style={styles.column}>
            <h4 style={styles.columnTitle}>Get in Touch</h4>
            <address style={styles.contactInfo}>
              <p style={styles.contactItem}>
                <FaMapMarkerAlt style={styles.contactIcon} />
                Shop 21 Zone A, Lebowakgomo Complex,
                <br />
                Lebowakgomo, 0737, Limpopo
              </p>
              <p style={styles.contactItem}>
                <FaPhoneAlt style={styles.contactIcon} />
                <a href="tel:+27156334143" style={styles.link}>
                  +27 15 633 4143
                </a>
              </p>
              <p style={styles.contactItem}>
                <FaEnvelope style={styles.contactIcon} />
                <a
                  href="mailto:info@lebowakgomodrycleaners.co.za"
                  style={styles.link}
                >
                  info@lebowakgomodrycleaners.co.za
                </a>
              </p>
            </address>
            <div style={styles.hours}>
              <h5 style={styles.hoursTitle}>Business Hours</h5>
              <ul style={styles.hoursList}>
                <li>Mon–Fri: 7am – 6pm</li>
                <li>Saturday: 7am – 5pm</li>
                <li>Sunday: 8am – 1pm</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div style={styles.copyright}>
          <p>
            &copy; {new Date().getFullYear()} Lebowakgomo Dry Cleaners. All
            rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        .footer-link:hover,
        .footer-column a:hover {
          color: #2C6B8F !important;
        }
        @media (max-width: 992px) {
          .footer > div > div:first-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#1E2A3A",
    color: "#F5F7FA",
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    borderTop: "4px solid #2C6B8F",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "3rem 1.5rem 1rem",
  },
  mainContent: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "2rem",
    marginBottom: "2rem",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  logo: {
    height: "64px",
    width: "auto",
    maxWidth: "100%",
    objectFit: "contain",
    marginBottom: "1rem",
  },
  tagline: {
    fontSize: "0.9rem",
    color: "#CBD5E0",
    marginBottom: "1.2rem",
    lineHeight: 1.5,
  },
  columnTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#C9A53A",
    letterSpacing: "0.5px",
  },
  linkList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  link: {
    color: "#CBD5E0",
    textDecoration: "none",
    fontSize: "0.9rem",
    lineHeight: "2",
    transition: "color 0.2s",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  arrowIcon: {
    fontSize: "0.75rem",
    verticalAlign: "middle",
  },
  contactInfo: {
    fontStyle: "normal",
    marginBottom: "1.2rem",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.75rem",
    fontSize: "0.9rem",
    color: "#CBD5E0",
  },
  contactIcon: {
    fontSize: "0.9rem",
    minWidth: "18px",
    color: "#C9A53A",
  },
  hours: {
    marginTop: "0.5rem",
  },
  hoursTitle: {
    fontSize: "0.9rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: "#C9A53A",
  },
  hoursList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    fontSize: "0.85rem",
    color: "#CBD5E0",
    lineHeight: 1.6,
  },
  copyright: {
    borderTop: "1px solid rgba(44,107,143,0.3)",
    paddingTop: "1.5rem",
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: "0.85rem",
  },
};

export default Footer;