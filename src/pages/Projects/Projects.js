import React from "react";
import ProjectsHero from "./ProjectsComponents/ProjectsHero";
import ProjectFilters from "./ProjectsComponents/ProjectFilters";
import ProjectList from "./ProjectsComponents/ProjectList";
import ProjectCard from "./ProjectsComponents/ProjectCard";
import ProjectDetailsModal from "./ProjectsComponents/ProjectDetailsModal";
import CaseStudies from "./ProjectsComponents/CaseStudies";
import Testimonials from "./ProjectsComponents/Testimonials";

const Projects = () => {
  return (
    <main>
      <div>hey i'm Projects page</div>
      <ProjectsHero />
      <ProjectFilters />
      <ProjectList />
      <ProjectCard />
      <ProjectDetailsModal />
      <CaseStudies />
      <Testimonials />
    </main>
  );
};

export default Projects;
