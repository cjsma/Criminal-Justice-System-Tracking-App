import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import '../styles/ManageMostWanted.css';

const ManageMostWanted = () => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'mostWanted'));
      setList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteDoc(doc(db, 'mostWanted', id));
        fetchData();
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="manage-container">
      <h2>Manage Most Wanted</h2>
      {isLoading ? (
        <p className="loading">Loading most wanted list...</p>
      ) : list.length === 0 ? (
        <p className="loading">No most wanted individuals found.</p>
      ) : (
        <ul className="most-wanted-list">
          {list.map((person) => (
            <li key={person.id} className="most-wanted-item">
              <h3>{person.name}</h3>
              <div className="person-info">
                {person.crime && <p><strong>Crime:</strong> {person.crime}</p>}
                {person.lastSeen && <p><strong>Last Seen:</strong> {person.lastSeen}</p>}
                {person.photoUrl && (
                  <div className="photo-preview">
                    <img 
                      src={person.photoUrl} 
                      alt={person.name} 
                      style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }}
                    />
                  </div>
                )}
              </div>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(person.id)}
              >
                Delete Entry
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageMostWanted;