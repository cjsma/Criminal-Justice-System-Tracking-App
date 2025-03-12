import React from 'react';
import { Link } from 'react-router-dom';

const PoliceOfficerDashboard = () => {
  return (
    <div>
      <h1>Police Officer Dashboard</h1>

      {/* Navigation Links */}
      <nav>
        <ul>
          <li>
            <Link to="/missingPerson">Missing Persons</Link>
          </li>
        </ul>
      </nav>

      {/* Police Officer specific content */}
    </div>
  );
};

export default PoliceOfficerDashboard;
