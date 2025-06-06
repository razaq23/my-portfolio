import React from "react";
import { HashRouter as Router } from "react-router-dom"; // 🔁 Changed here
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
    <Router> {/* ✅ HashRouter prevents GitHub Pages 404 issues */}
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
