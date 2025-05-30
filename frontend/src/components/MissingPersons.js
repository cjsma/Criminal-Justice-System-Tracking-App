import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import the logo from local assets
import './MissingPersons.css'; // Import CSS for styling

const MissingPersons = () => {
  const navigate = useNavigate();

  const handleButtonClick = (option) => {
    if (option === 'report') {
      navigate('/report-missing-person');
    } else if (option === 'list') {
      navigate('/list-missing-persons');
    }
  };

  return (
    <div className="missing-persons-container">
      <div className="missing-persons-box">
        <img src={logo} alt="Organization Logo" className="logo" />
        <h1>Missing Persons</h1>

        {/* New small heading */}
        <h2>Please select an option below</h2>

        <div className="buttons-container">
          <button
            className="action-button"
            onClick={() => handleButtonClick('report')}
            aria-label="Report a missing person"
          >
            Report Missing Person
          </button>
          <button
            className="action-button"
            onClick={() => handleButtonClick('list')}
            aria-label="View list of missing persons"
          >
            List of Missing Persons
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissingPersons;
