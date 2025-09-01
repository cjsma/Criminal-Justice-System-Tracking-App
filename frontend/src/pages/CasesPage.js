import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/GeneralDashboard.css';

const CasesPage = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(db, 'cases'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const casesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCases(casesData);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch cases. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (loading) return <p className="loading-message">Loading cases...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (cases.length === 0) return <p className="no-cases-message">No cases found.</p>;

  return (
    <div className="general-user-dashboard">
      <h2>Your Cases</h2>

      <div className="cases-grid">
        {cases.map(caseItem => (
          <CaseCard key={caseItem.id} caseItem={caseItem} navigate={navigate} />
        ))}
      </div>
    </div>
  );
};

const CaseCard = ({ caseItem, navigate }) => (
  <div className="case-card" onClick={() => navigate(`/case/${caseItem.id}`)}>
    <h3>Case Number: {caseItem.caseNumber}</h3>
    <p><strong>Assigned Officer:</strong> {caseItem.assignedOfficer || 'Not assigned'}</p>
    <p><strong>Police Station:</strong> {caseItem.policeStation}</p>
    <p><strong>Status:</strong> <span className={`status-${caseItem.status.toLowerCase()}`}>{caseItem.status}</span></p>
    <button
      className="edit-button"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/edit-case/${caseItem.id}`);
      }}
    >
      Edit
    </button>
  </div>
);

export default CasesPage;
