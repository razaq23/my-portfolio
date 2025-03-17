import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const AutoLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        if (decoded.exp < currentTime) {
          logout();
        }
      } catch (error) {
        logout();
      }
    };

    // Check immediately on mount
    checkTokenExpiration();

    // Set up interval check every 30 seconds
    const interval = setInterval(checkTokenExpiration, 30 * 1000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};

export default AutoLogout;