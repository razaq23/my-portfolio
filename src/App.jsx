import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/home";
import Education from "./components/education";
import educationData from "./EducationDate";
import SkillsData from "./skills.js";
import Skills from "./components/skills";
import Experience from "./components/experience";
import Contact from "./components/contact.jsx";
import Projects from "./components/project.jsx";

const App = () => {
  return (
    <Router>
      <Navbar />
      
           
              <Home />
              <Education educationData={educationData} />
              <Skills SkillsData={SkillsData} />
              <Experience />
              <Projects />
              <Contact />
           
         
    </Router>
  );
};

export default App;
