import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./components/home";
import Education from "./components/education";
import educationData from "./EducationDate";
import SkillsData from "./skills.js";
import Skills from "./components/skills";
import Experience from "./components/experience";
import Contact from "./components/contact.jsx";
import Projects from "./components/project.jsx";
import Login from "./components/login";
import Signup from "./components/signup";
import AutoLogout from "./components/AutoLogout";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Remove this part from App.jsx's useEffect:
const tokenCheckInterval = setInterval(() => {
  fetch("http://localhost:5000/api/user", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  // ...
}, 5 * 60 * 1000);
  useEffect(() => {
    const checkAuth = async () => {
      // Check for token in URL params (from Google OAuth redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      if (token) {
        localStorage.setItem("token", token);
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/auth/user", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Periodic token validation to check expiration
    const tokenCheckInterval = setInterval(() => {
      fetch("http://localhost:5000/api/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            localStorage.removeItem("token");
            setUser(null);
            window.location.href = "/login"; // Redirect on token expiration
          }
          return res.json();
        })
        .catch((error) => console.error("Token check failed:", error));
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(tokenCheckInterval);
  }, []);

  const handleLogout = () => {
    // Clear both session and JWT
    localStorage.removeItem("token");
    axios.get("http://localhost:5000/auth/logout", { withCredentials: true }).then(() => setUser(null));
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <Router>
      <AutoLogout />
      {user && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <>
                <Home user={user} />
                <Education educationData={educationData} />
                <Skills SkillsData={SkillsData} />
                <Experience />
                <Projects />
                <Contact />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup setUser={setUser} />} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
