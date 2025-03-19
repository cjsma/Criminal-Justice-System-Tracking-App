import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AddCaseForm from '../components/AddCaseForm';
import '../styles/GeneralDashboard.css';

function GeneralUserDashboard() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCaseForm, setShowAddCaseForm] = useState(false);

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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const handleAddCaseSuccess = () => {
    setShowAddCaseForm(false);
    // Refetch cases after adding a new case
    setCases();
  };

  return (
    <div className="general-user-dashboard">
      <h1>General User Dashboard</h1>
      <button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>
        Logout
      </button>

      {/* Buttons for Adding a Case and Reporting a Missing Person */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setShowAddCaseForm(!showAddCaseForm)}>
          {showAddCaseForm ? 'Cancel' : 'Add New Case'}
        </button>
        <button onClick={() => navigate('/missingPerson')}>
          Missing Person
        </button>
      </div>

      {/* Render the AddCaseForm if showAddCaseForm is true */}
      {showAddCaseForm && <AddCaseForm onSuccess={handleAddCaseSuccess} />}

      {/* List of Cases */}
      <div className="cases-list">
        <h2>Your Cases</h2>
        {loading ? (
          <p>Loading cases...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : cases.length === 0 ? (
          <p>No cases found.</p>
        ) : (
          cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="case-item"
              onClick={() => navigate(`/case/${caseItem.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <h3>Case Number: {caseItem.caseNumber}</h3>
              <p>Assigned Officer: {caseItem.assignedOfficer}</p>
              <p>Police Station: {caseItem.policeStation}</p>
              <p>Status: {caseItem.status}</p>
              <p>Incident Description: {caseItem.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GeneralUserDashboard;