import React from 'react';
import './home.css';

function Home() {
  return (
    <div className="home" id='home'>
      <img src="images/my-img.jpg" alt="Profile" />

      <div className="about">
        <h3>Hello, I'm</h3>
        <h2>Abdul Razaq</h2>
        <h3>Full Stack Web Developer</h3>

        <div className="social-links">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-linkedin"></i>
          </a>

          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-github"></i>
          </a>

          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-instagram"></i>
          </a>

          <a href="public/razaq-cv.pdf" download className="download-cv">
            
            <span> Download CV</span>
            <i className="fa-solid fa-download"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
