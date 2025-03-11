import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for navigation
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero-section">
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
            <Link to="/login" className="btn-secondary">
              Log In
            </Link>
            <Link to="/signup" className="btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default LandingPage;
