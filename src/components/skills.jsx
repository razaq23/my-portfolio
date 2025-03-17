import React from "react";
import "./skills.css";

function Skills({ SkillsData }) {  
  return (
    <section id="skills" className="skills">
      <h2>Skills</h2>
      <div className="skills-container">
        {SkillsData.map((skill, index) => (
          <div key={index} className="skills-card">
            <h3>{skill.category}</h3>
            <div className="skills-list">
              {skill.skills.map((item, i) => (
                <span key={i} className="skill">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
