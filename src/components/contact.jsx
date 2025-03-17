import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./contact.css";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_ruph4kb",
        "template_razaq2355",
        {
          name: name, // Sender's name
          email: email, // Sender's email
          message: message, // Message content
          time: new Date().toLocaleString(), // Current timestamp
        },
        "Yw3Lmvoa3h9Z11VzI"
      )
      .then(() => {
        setStatus("✅ Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch(() => setStatus("❌ Failed to send. Try again!"));
  };

  return (
    <div id="contact" className="contact-container">
      <h2>Contact Me</h2>
      <form onSubmit={sendEmail}>
        <input 
          type="text" 
          placeholder="Your Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Your Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Your Message" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
        />
        <button type="submit">Send Message</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default Contact;