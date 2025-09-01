import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/MostWanted.css';
import { PlusCircle, Edit3, Search } from 'lucide-react';

const MostWanted = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="general-user-dashboard">
      <header className="dashboard-header">
        <h1>Most Wanted Individuals</h1>
        <p>Select an action:</p>
      </header>

      <div className="option-card-grid">
        {role === 'police_officer' && (
          <>
            <div className="option-card" onClick={() => navigate('/add-most-wanted')}>
              <PlusCircle size={28} className="option-icon" />
              <h3>Add Most Wanted</h3>
              <p>Add a new individual to the most wanted list.</p>
            </div>

            <div className="option-card" onClick={() => navigate('/manage-most-wanted')}>
              <Edit3 size={28} className="option-icon" />
              <h3>Manage Most Wanted</h3>
              <p>Edit or remove entries from the most wanted list.</p>
            </div>
          </>
        )}

        <div className="option-card" onClick={() => navigate('/list-most-wanted')}>
          <Search size={28} className="option-icon" />
          <h3>View Most Wanted List</h3>
          <p>See all individuals currently wanted by law enforcement.</p>
        </div>
      </div>
    </div>
  );
};

export default MostWanted;
