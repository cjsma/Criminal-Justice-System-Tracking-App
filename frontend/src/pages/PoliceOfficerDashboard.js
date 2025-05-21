import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PoliceOfficerDashboard.css';

const PoliceOfficerDashboard = () => {
  const navigate = useNavigate();

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
        <h1>Correctional Service Information</h1>

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
            onClick={() => navigate('/applyProtection')}
            className="action-button"
          >
            Apply for Protection
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
  );
};

export default PoliceOfficerDashboard;
