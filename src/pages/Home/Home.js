import React, { useEffect } from "react";
import HeroSection from "./HomeComponents/HeroSection";
import AdvertisingSection from "./HomeComponents/AdvertisingSection";
import CallToActionSection from "./HomeComponents/CallToActionSection";
import ServicesSection from "./HomeComponents/ServicesSection";
import JobListingsSection from "./HomeComponents/JobListingsSection";
import TestimonialsSection from "./HomeComponents/TestimonialsSection";

const BASE = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8000'
  : 'https://www.dlamsoft.co.za';

const Home = () => {
  useEffect(() => {
    // Track home page visit — plain fetch, no imports needed
    fetch(`${BASE}/api/track/visit/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'home' }),
    }).catch(() => {}); // silent — never blocks the UI
  }, []);

  return (
    <main>
      <HeroSection />
      <AdvertisingSection />
      <CallToActionSection />
      <ServicesSection />
    </main>
  );
};

export default Home;