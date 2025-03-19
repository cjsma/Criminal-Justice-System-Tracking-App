import React from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming you have an auth context
import '../styles/Profile.css';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-info">
        <img
          src={user?.photoURL || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="profile-image"
        />
        <h2>{user?.displayName || 'No Name'}</h2>
        <p>{user?.email}</p>
      </div>
    </div>
  );
}

export default Profile;
