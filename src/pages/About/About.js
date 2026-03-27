import React from "react";
import AboutHero from "./AboutComponents/AboutHero";
import MissionSection from "./AboutComponents/MissionSection";
import HistorySection from "./AboutComponents/HistorySection";
import TeamSection from "./AboutComponents/TeamSection";
import ValuesSection from "./AboutComponents/ValuesSection";
import StatsSection from "./AboutComponents/StatsSection";
import TimelineSection from "./AboutComponents/TimelineSection";
import AboutCTA from "./AboutComponents/AboutCTA";
import CallToActionSection from "./AboutComponents/CallToActionSection";

const About = () => {
  return (
    <main>
      <AboutHero />
      <MissionSection />
      <CallToActionSection />
      <ValuesSection />
      <AboutCTA />
    </main>
  );
};


export default About;
