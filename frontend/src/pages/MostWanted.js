import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MostWanted = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const handleViewList = () => navigate('/list-most-wanted');
  const handleAdd = () => navigate('/add-most-wanted');
  const handleManage = () => navigate('/manage-most-wanted');

  return (
    <div className="most-wanted-container">
      <h1>Most Wanted Individuals</h1>
      <p>Select an action:</p>

      {role === 'police_officer' ? (
        <>
          <button onClick={handleAdd}>Add Most Wanted</button>
          <button onClick={handleManage}>Manage Most Wanted</button>
          <button onClick={handleViewList}>View List</button>
        </>
      ) : (
        <button onClick={handleViewList}>View Most Wanted List</button>
      )}
    </div>
  );
};

export default MostWanted;
