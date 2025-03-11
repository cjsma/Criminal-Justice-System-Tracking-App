import React from 'react';
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
            <a href="/login" className="btn-secondary">
              Log In
            </a>
            <a href="/signup" className="btn-primary">
              Sign Up
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}

export default LandingPage;
