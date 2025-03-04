import React from "react";
import "./LandngPage.css";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <img
            src="https://i.postimg.cc/FH0rkXfF/IMG-20241205-WA0007.png"
            alt="App Logo"
            className="logo"
          />
          <h1>Welcome to the Criminal Justice Tracking App</h1>
          <p className="hero-description">
            Ensuring a fair and effective criminal justice system that focuses
            on public safety, accountability, and supporting communities in
            seeking justice and healing.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Log In</button>
            <button className="btn-secondary">Sign Up</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>About Us</h2>
        <div className="features-container">
          <div className="feature-card">
            <h3>Transparency</h3>
            <p>Access a justice system built on openness and integrity.</p>
          </div>
          <div className="feature-card">
            <h3>Accountability</h3>
            <p>Hold offenders accountable and promote safer communities.</p>
          </div>
          <div className="feature-card">
            <h3>Community Support</h3>
            <p>Empower victims and communities with tools to seek justice.</p>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="stats-section">
        <h2>Our Impact in Numbers</h2>
        <div className="stats-container">
          <div className="stat-card">
            <h3>10,000+</h3>
            <p>Cases Tracked</p>
          </div>
          <div className="stat-card">
            <h3>5,000+</h3>
            <p>Users Registered</p>
          </div>
          <div className="stat-card">
            <h3>98%</h3>
            <p>Resolution Rate</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-section">
        <h2>Our Mission and Vision</h2>
        <p>
          <strong>Mission:</strong> To provide a transparent, accessible, and
          efficient system that promotes justice and supports all individuals
          involved.
        </p>
        <p>
          <strong>Vision:</strong> To create a justice system where fairness and
          accountability lead to safer communities and healing for victims and
          offenders alike.
        </p>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-content">
          <h2>Contact Us</h2>
          <p>
            <FaEnvelope className="icon" />
            info@criminaljusticetrackingapp.com
          </p>
          <p>
            <FaPhoneAlt className="icon" /> +27 71 234 5678
          </p>
          <p>
            <FaWhatsapp className="icon" />{" "}
            <a
              href="https://wa.me/27712345678"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat with us on WhatsApp
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
