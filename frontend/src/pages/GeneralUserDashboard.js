import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/GeneralDashboard.css';

function GeneralUserDashboard() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cases for the logged-in user
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const casesQuery = query(
            collection(db, 'cases'),
            where('userId', '==', user.uid)
          );
          const querySnapshot = await getDocs(casesQuery);
          const casesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCases(casesData);
        }
      } catch (err) {
        setError('Failed to fetch cases. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const handleLogoutAndNavigate = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
      setError('Failed to logout. Please try again.');
    }
  };

  return (
    <div className="general-user-dashboard">
      <header className="dashboard-header">
        <h1>General User Dashboard</h1>
      </header>

      <div className="action-buttons">
        <button
          onClick={() => navigate('/missingPerson')}
          className="action-button"
        >
          Report Missing Person
        </button>
        <button onClick={() => navigate('/addCase')} className="action-button">
          Add New Case
        </button>
      </div>

      {/* List of Cases */}
      <div className="cases-list">
        <h2>Your Cases</h2>
        {loading ? (
          <p className="loading-message">Loading cases...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : cases.length === 0 ? (
          <p className="no-cases-message">No cases found.</p>
        ) : (
          <div className="cases-grid">
            {cases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="case-card"
                onClick={() => navigate(`/case/${caseItem.id}`)}
              >
                <h3>Case Number: {caseItem.caseNumber}</h3>
                <p>
                  <strong>Assigned Officer:</strong>{' '}
                  {caseItem.assignedOfficer || 'Not assigned'}
                </p>
                <p>
                  <strong>Police Station:</strong> {caseItem.policeStation}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status-${caseItem.status.toLowerCase()}`}>
                    {caseItem.status}
                  </span>
                </p>
                <p>
                  <strong>Incident Description:</strong> {caseItem.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GeneralUserDashboard;
