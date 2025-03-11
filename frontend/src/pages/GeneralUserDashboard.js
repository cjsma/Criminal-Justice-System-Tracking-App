import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const GeneralUserDashboard = () => {
  const { currentUser, role } = useAuth();

  return (
    <div>
      <h1>Welcome, General User!</h1>
      <p>Email: {currentUser?.email}</p>
      <p>Role: {role}</p>

      <div>
        <h2>Quick Actions</h2>
        <ul>
          <li>
            <Link to="/missingPerson">View Missing Persons</Link>
          </li>
          <li>
            <Link to="/reportCase">Report a Case</Link>
          </li>
        </ul>
      </div>

      <div>
        <h2>Recent Activity</h2>
        <p>No recent activity.</p>
      </div>
    </div>
  );
};

export default GeneralUserDashboard;
