import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './ListMissingPersons.css'; // Import the CSS file

const ListMissingPersons = () => {
  const [missingPersons, setMissingPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch missing persons data from Firestore
  useEffect(() => {
    const fetchMissingPersons = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'missingPersons'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMissingPersons(data);
      } catch (error) {
        console.error('Error fetching missing persons:', error);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMissingPersons();
  }, []);

  return (
    <div className="list-missing-persons-container">
      <h1>List of Missing Persons</h1>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul>
          {missingPersons.map((person) => (
            <li key={person.id}>
              <strong>{person.name}</strong> (Age: {person.age}) - Last seen in{' '}
              {person.lastSeen}
              <p>{person.description}</p>
              {/* Display photo if available */}
              {person.photoUrl && (
                <div className="photo-container">
                  <img
                    src={person.photoUrl}
                    alt={`${person.name}`}
                    className="photo"
                  />
                </div>
              )}
              {/* Display documents if available */}
              {person.documentUrls && person.documentUrls.length > 0 && (
                <div className="documents-container">
                  <h4>Documents:</h4>
                  <ul>
                    {person.documentUrls.map((url, index) => (
                      <li key={index}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          Document {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/report-missing-person')}>
        Report New Missing Person
      </button>
    </div>
  );
};

export default ListMissingPersons;
