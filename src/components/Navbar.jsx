import React from 'react';
import './Navbar.css';

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <h2>My Portfolio</h2>
      <ul className="nav-menu">
        <li><a href="#home">Home</a></li>
        <li><a href="#education">Education</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      
    </nav>
  );
}

export default Navbar;