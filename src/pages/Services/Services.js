import React from "react";
import ServicesHero from "./ServicesComponents/ServicesHero";
import ServicesAreaSection from "./ServicesComponents/ServicesAreaSection";
import ServiceCard from "./ServicesComponents/ServiceCard";
import PricingSection from "./ServicesComponents/PricingSection";
import FAQSection from "./ServicesComponents/FAQSection";
import ComparisonTable from "./ServicesComponents/ComparisonTable";
import ServicesCTA from "./ServicesComponents/ServicesCTA";
import AdvertisingSection from "./ServicesComponents/AdvertisingSection";

const Services = () => {
  return (
    <main>
      <ServicesHero />
      <AdvertisingSection />
      <ServiceCard />

    </main>
  );
};

export default Services;

