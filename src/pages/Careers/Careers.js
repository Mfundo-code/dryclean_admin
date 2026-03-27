import React, { useEffect } from "react";
import CareersHero from "./CareersComponents/CareersHero";
import AvailableVacancies from "./CareersComponents/AvailableVacancies";


const Blog = () => {
  return (
    <main>
      <CareersHero />
      <AvailableVacancies />
    </main>
  );
};

export default Blog;