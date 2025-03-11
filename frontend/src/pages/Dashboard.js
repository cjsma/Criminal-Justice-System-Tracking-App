import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.role}</h1>

      {user?.role === 'General User' && (
        <div>
          <p>Manage your cases.</p>
          <a href="/cases">View Cases</a>
        </div>
      )}

      {user?.role === 'SAPS' && <p>View & update case statuses.</p>}
      {user?.role === 'Correction' && <p>Manage prison-related records.</p>}
      {user?.role === 'Wanted Databases' && (
        <p>View & upload wanted persons.</p>
      )}
      {user?.role === 'Missing Databases' && (
        <p>View & upload missing persons.</p>
      )}
    </div>
  );
};

export default Dashboard;
