import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/MissingPersonDetails.css';

const MissingPersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        const docRef = doc(db, 'missingPersons', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const personData = docSnap.data();
          setPerson({
            id: docSnap.id,
            ...personData,
            reportedAt:
              personData.reportedAt?.toDate().toLocaleString() || 'N/A',
          });
        } else {
          setError('No such person found!');
        }
      } catch (err) {
        console.error('Error fetching person details:', err);
        setError('Failed to load person details');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading person details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/missing-persons')}>
          Back to Missing Persons
        </button>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="not-found-container">
        <h2>Person Not Found</h2>
        <button onClick={() => navigate('/missing-persons')}>
          Back to Missing Persons
        </button>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="details-header">
        <h1>{person.name}</h1>
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
      </div>

      <div className="details-content">
        <div className="image-section">
          {person.photoUrl ? (
            <img
              src={person.photoUrl}
              alt={`${person.name}`}
              className="person-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-profile.jpg';
              }}
            />
          ) : (
            <div className="image-placeholder">
              <span>No Image Available</span>
            </div>
          )}
        </div>

        <div className="info-section">
          <div className="info-grid">
            <div className="info-item">
              <h3>Age</h3>
              <p>{person.age || 'Unknown'}</p>
            </div>
            <div className="info-item">
              <h3>Last Seen Date</h3>
              <p>{person.lastSeenDate || 'Unknown'}</p>
            </div>
            <div className="info-item">
              <h3>Last Seen Location</h3>
              <p>{person.lastSeenLocation || 'Unknown'}</p>
            </div>
            <div className="info-item">
              <h3>Reported On</h3>
              <p>{person.reportedAt}</p>
            </div>
          </div>

          <div className="description-section">
            <h3>Description</h3>
            <p>{person.description || 'No description available.'}</p>
          </div>

          {person.additionalInfo && (
            <div className="additional-info">
              <h3>Additional Information</h3>
              <p>{person.additionalInfo}</p>
            </div>
          )}

          {person.contactInfo && (
            <div className="contact-info">
              <h3>Contact Information</h3>
              <p>{person.contactInfo}</p>
            </div>
          )}
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="btn-primary"
          onClick={() => navigate(`/edit-missing-person/${id}`)}
        >
          Edit Information
        </button>
        <button
          className="btn-secondary"
          onClick={() => navigate('/missing-persons')}
        >
          View All Missing Persons
        </button>
      </div>
    </div>
  );
};

export default MissingPersonDetails;
