import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/ListMissingPersons.css';
import BackButton from '../components/BackButton';


const ListMissingPersons = () => {
  const [missingPersons, setMissingPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchMissingPersons = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'missingPersons'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          reportedAt: doc.data().reportedAt?.toDate().toLocaleString() || 'N/A',
        }));
        setMissingPersons(data);
      } catch (error) {
        console.error('Error fetching missing persons:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMissingPersons();
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/placeholder-profile.jpg'; // Fallback image
    e.target.style.display = 'none'; // Or show a placeholder
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading missing persons...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="list-missing-persons-container">
      <header className="list-header">
        <h1>Missing Persons Registry</h1>
        <div className="action-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate('/report-missing-person')}
          >
            Report New Missing Person
          </button>
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </header>

      {missingPersons.length === 0 ? (
        <div className="no-results">
          <p>No missing persons records found.</p>
        </div>
      ) : (
        <div className="missing-persons-grid">
          {missingPersons.map((person) => (
            <div key={person.id} className="person-card">
              {/* Image section - only shown if photoUrl exists */}
              {person.photoUrl && (
                <div className="image-section">
                  <img
                    src={person.photoUrl}
                    alt={`${person.name}`}
                    className="person-image"
                    onError={handleImageError}
                  />
                </div>
              )}

              <div className="person-info">
                <h2>{person.name}</h2>
                <p>
                  <strong>Age:</strong> {person.age || 'Unknown'}
                </p>
                <p>
                  <strong>Last Seen:</strong> {person.lastSeenDate} at{' '}
                  {person.lastSeenLocation}
                </p>
                <p>
                  <strong>Reported:</strong> {person.reportedAt}
                </p>
                <p className="description">{person.description}</p>
              </div>

              <button
                className="details-btn"
                onClick={() => navigate(`/missing-person/${person.id}`)}
              >
                View Details
              </button>
              
              <BackButton/>
            
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListMissingPersons;
