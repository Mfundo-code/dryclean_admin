// src/GlobalComponents/Header.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaPhone } from "react-icons/fa";
import LogoB from "../assets/images/LogoB.png"; // Ensure this path is correct

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <header style={styles.header}>
      {/* Top utility bar */}
      <div style={styles.topBar}>
        <span style={styles.topBarLeft}>info@lebowakgomodrycleaners.co.za</span>
        <span style={styles.topBarRight}>Call Us Today +27 15 633 4143 </span>
      </div>

      {/* Main navigation */}
      <nav style={styles.nav} aria-label="Main">
        {/* Logo with image */}
        <div style={styles.logo} onClick={() => navigate("/")}>
          <img
            src={LogoB}
            alt="Lebowakgomo Dry Cleaners"
            style={styles.logoImage}
          />
        </div>

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <div style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/services" style={styles.navLink}>Services</Link>
            <Link to="/track" style={styles.navLink}>Track Order</Link>
          </div>
        )}

        {/* Desktop Contact Button */}
        {!isMobile && (
          <Link to="/contact" style={styles.contactButton}>Contact</Link>
        )}

        {/* Mobile Icons */}
        {isMobile && (
          <div style={styles.mobileNav}>
            <Link to="/contact" style={styles.mobileContactIcon}>
              <FaPhone />
            </Link>
            <button
              type="button"
              style={styles.mobileMenuButton}
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && isMobile && (
        <div style={styles.mobileOverlay} onClick={toggleMobileMenu}>
          <div style={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={toggleMobileMenu}>
              <FaTimes />
            </button>
            <div style={styles.mobileLinks}>
              <Link to="/" style={styles.mobileLink} onClick={toggleMobileMenu}>Home</Link>
              <Link to="/services" style={styles.mobileLink} onClick={toggleMobileMenu}>Services</Link>
              <Link to="/track" style={styles.mobileLink} onClick={toggleMobileMenu}>Track Order</Link>
              <Link to="/contact" style={styles.mobileContactLink} onClick={toggleMobileMenu}>Contact</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

/*
  Color palette:
  --primary-blue   : #2C6B8F  (main identity – trust, cleanliness)
  --white          : #FFFFFF  (background – hygiene)
  --navy-dark      : #1E2A3A  (accents – stability, professionalism)
  --grey-light     : #F5F7FA  (neutral – soft contrast)
  --grey-dark      : #4A5568  (text – readability)
*/

const styles = {
  header: {
    position: "sticky",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: "#FFFFFF",
    color: "#1E2A3A",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "9px 20px",
    fontSize: "13px",
    backgroundColor: "#1E2A3A",
    color: "#FFFFFF",
  },
  topBarLeft: {
    fontWeight: "500",
    letterSpacing: "0.4px",
  },
  topBarRight: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
  logo: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  logoImage: {
    height: "64px",
    width: "auto",
    maxWidth: "100%",
    objectFit: "contain",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },
  navLink: {
    color: "#1E2A3A",
    textDecoration: "none",
    fontSize: "17px",
    fontWeight: "500",
    transition: "color 0.2s",
    "&:hover": {
      color: "#2C6B8F",
    },
  },
  contactButton: {
    border: "2px solid #2C6B8F",
    borderRadius: "6px",
    padding: "10px 24px",
    color: "#2C6B8F",
    textDecoration: "none",
    fontSize: "17px",
    fontWeight: "600",
    transition: "all 0.2s",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "#2C6B8F",
      color: "#FFFFFF",
      borderColor: "#2C6B8F",
    },
  },
  mobileNav: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  mobileContactIcon: {
    color: "#2C6B8F",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
  },
  mobileMenuButton: {
    background: "none",
    border: "none",
    color: "#1E2A3A",
    fontSize: "28px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  mobileOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 200,
    display: "flex",
    justifyContent: "flex-end",
  },
  mobileMenu: {
    width: "280px",
    height: "100%",
    backgroundColor: "#1E2A3A",
    padding: "24px",
    position: "relative",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "#FFFFFF",
    fontSize: "24px",
    position: "absolute",
    top: "16px",
    right: "16px",
    cursor: "pointer",
  },
  mobileLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "48px",
  },
  mobileLink: {
    color: "#FFFFFF",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "500",
  },
  mobileContactLink: {
    color: "#2C6B8F",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "600",
    border: "2px solid #2C6B8F",
    borderRadius: "4px",
    padding: "10px",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
  },
};

export default Header;