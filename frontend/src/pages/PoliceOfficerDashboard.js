import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import '../styles/PoliceOfficerDashboard.css';

const PoliceOfficerDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Officer'); // Added state for userName
  const [error, setError] = useState(''); // Added state for error

  return (
    <div className="correctional-service-page">
      <div className="form-container">
        <div className="logo-container">
          <img
            className="logo"
            src="https://i.postimg.cc/FH0rkXfF/IMG-20241205-WA0007.png"
            alt="Logo"
          />
        </div>
        <header className="dashboard-header">
            <h1>Welcome, {userName}!</h1> {/* Now userName is defined */}
          </header>
        <div className="general-user-dashboard">

          {error && <div className="alert alert-error">{error}</div>} {/* Now error is defined */}

          <div className="action-buttons">
            <button
              onClick={() => navigate('/missingPerson')}
              className="action-button"
            >
              Report Missing Person
            </button>
            <button
              onClick={() => navigate('/addCase')}
              className="action-button"
            >
              Add New Case
            </button>
            <button
              onClick={() => navigate('/apply-protection')}
              className="action-button protection-order-btn"
            >
              Apply for Protection Order
            </button>
            <button
              onClick={() => navigate('/mostWanted')}
              className="action-button"
            >
              Wanted by Law
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceOfficerDashboard;