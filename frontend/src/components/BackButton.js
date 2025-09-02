import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BackButton.css'; // optional for extra styling

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="back-btn"
      onClick={() => navigate(-1)}
    >
      ← Back
    </button>
  );
};

export default BackButton;
