import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';
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
          <div>
          <h1>Welcome to the Criminal Justice Tracking App</h1>
          <p className="hero-description">
            Ensuring a fair and effective criminal justice system that focuses
            on public safety, accountability, and supporting communities in
            seeking justice and healing.
          </p>
          </div>
          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">Log In</Link>
            <Link to="/Signup" className="btn-secondary">Sign Up</Link>
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

      {/* Services Section */}
      <section className="features-section">
        <h2>Services</h2>
        <div className="features-container"> 
          
          <div className="feature-card">
            <Link to="/login">
            <h3>Protection Order </h3>
            <p>Apply for protection oder here</p>
            </Link>
          </div>
          
          
          <div className="feature-card">
            <Link to="/login">
            <h3>Missing Person</h3>
            <p>Report a Missing Person here</p>
            </Link>
          </div> 

          <div  className="feature-card">
          <Link to="/submit-tip">
          <h3>Submit Anonymous Tip</h3>
          <p>Submit your Anonymous Tip here</p>
          </Link>
          </div>
          
          <Link to="/login">
          <div className="feature-card">
            <h3>Wanted Persons</h3>
            <p>Look for Wanted People here</p>
          </div>
          </Link>
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
        <div className="mission-content">
          <div className="mission-item">
            <h3>Mission</h3>
            <p>To provide a transparent, accessible, and
            efficient system that promotes justice and supports all individuals
            involved.</p>
          </div>
          <div className="mission-item">
            <h3>Vision</h3>
            <p>To create a justice system where fairness and
            accountability lead to safer communities and healing for victims and
            offenders alike.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-content">
          <h2>Contact Us</h2>
          <div className="contact-method">
            <FaEnvelope className="icon" />
            <span>info@criminaljusticetrackingapp.com</span>
          </div>
          <div className="contact-method">
            <FaPhoneAlt className="icon" />
            <span>+27 71 234 5678</span>
          </div>
          <div className="contact-method">
            <FaWhatsapp className="icon" />
            <a
              href="https://wa.me/27712345678"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
            >
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;