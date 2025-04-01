import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/Profile.css';

function Profile() {
  const { currentUser, role } = useAuth();
  const [policeInfo, setPoliceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role === 'police_officer' && currentUser?.uid) {
      const fetchPoliceInfo = async () => {
        try {
          const docRef = doc(db, 'policeOfficers', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setPoliceInfo(docSnap.data());
          } else {
            setPoliceInfo(null);
            setError('No police officer record found.');
          }
        } catch (err) {
          console.error('Error fetching police officer details:', err);
          setError('Failed to load officer details. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchPoliceInfo();
    } else {
      setLoading(false);
    }
  }, [currentUser, role]);

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-info">
        <img
          src={currentUser?.photoURL || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="profile-image"
        />
        <h2>{currentUser?.displayName || 'No Name'}</h2>
        <p>{currentUser?.email}</p>
      </div>

      {role === 'police_officer' && (
        <div className="police-info">
          <h2>Correctional Services Information</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : policeInfo ? (
            <>
              <p>
                <strong>Officer Name:</strong>{' '}
                {policeInfo.officerName || 'Not Available'}
              </p>
              <p>
                <strong>Employee Number:</strong>{' '}
                {policeInfo.employeeNumber || 'Not Available'}
              </p>
              <p>
                <strong>Ranking:</strong>{' '}
                {policeInfo.ranking || 'Not Available'}
              </p>
              <p>
                <strong>Province:</strong>{' '}
                {policeInfo.province || 'Not Available'}
              </p>
              <p>
                <strong>Service Name:</strong>{' '}
                {policeInfo.serviceName || 'Not Available'}
              </p>
            </>
          ) : (
            <p>No correctional services information found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
