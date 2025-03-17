import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.post("http://localhost:5000/auth/signup", formData);
      if (res.data.userId) {
        setUserId(res.data.userId);
        setResendCooldown(60); // 60-second cooldown for resend
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.post("http://localhost:5000/auth/verify-otp", {
        userId,
        otp: otp.toString(),
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      await axios.post("http://localhost:5000/auth/resend-otp", { userId });
      setResendCooldown(60);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>{userId ? "Verify Email" : "Sign Up"}</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {!userId ? (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength="6"
                required
              />
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="6-digit code from email"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                pattern="\d{6}"
                required
              />
              <small>Check your email for the verification code</small>
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>

            <div className="resend-otp">
              {resendCooldown > 0 ? (
                <span>Resend OTP in {resendCooldown}s</span>
              ) : (
                <button type="button" onClick={handleResendOTP} disabled={loading}>
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        <div className="signup-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
