import React from 'react';
import './education.css';

function Education({ educationData }) {
  return (
    <section id="education" className="education">
      <h2>EDUCATION</h2>
      <div className="timeline">
        {educationData.map((edu, index) => (
          <div key={index} className="timeline-item">
            <h3>{edu.title}</h3>
            <p>{edu.institute}</p>
            <p>{edu.cgpa}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Education;
