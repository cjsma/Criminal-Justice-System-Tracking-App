import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
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
        <button onClick={handleLogoutAndNavigate} className="logout-button">
          Logout
        </button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

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
        <button
          onClick={() => navigate('/apply-protection')}
          className="action-button protection-order-btn"
        >
          Apply for Protection Order
        </button>

        <button
          onClick={() => navigate('/mostWanted')}
          className="action-button"
        >
          Wanted by Law
        </button>
      </div>

      {/* Cases List Section */}
      <CasesList
        loading={loading}
        error={error}
        cases={cases}
        navigate={navigate}
      />
    </div>
  );
}

// Extracted Modal Component for better organization
const ProtectionOrderModal = ({
  isOpen,
  onClose,
  onSubmit,
  details,
  setDetails,
  submitting,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content">
        <h2>Protection Order Application</h2>
        <div className="form-group">
          <label htmlFor="protectionDetails">
            Please describe why you need a protection order:
          </label>
          <textarea
            id="protectionDetails"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide specific details about threats, incidents, or concerns..."
            required
            rows={6}
          />
        </div>
        <div className="modal-actions">
          <button
            onClick={onSubmit}
            className="btn-primary"
            disabled={!details.trim() || submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
          <button onClick={onClose} className="btn-secondary">
            Save Draft
          </button>
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Extracted Cases List Component
const CasesList = ({ loading, error, cases, navigate }) => {
  if (loading) return <p className="loading-message">Loading cases...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (cases.length === 0)
    return <p className="no-cases-message">No cases found.</p>;

  return (
    <div className="cases-list">
      <h2>Your Cases</h2>
      <div className="cases-grid">
        {cases.map((caseItem) => (
          <CaseCard key={caseItem.id} caseItem={caseItem} navigate={navigate} />
        ))}
      </div>
    </div>
  );
};

// Extracted Case Card Component
const CaseCard = ({ caseItem, navigate }) => (
  <div className="case-card" onClick={() => navigate(`/case/${caseItem.id}`)}>
    <h3>Case Number: {caseItem.caseNumber}</h3>
    <p>
      <strong>Assigned Officer:</strong>{' '}
      {caseItem.assignedOfficer || 'Not assigned'}
    </p>
    <p>
      <strong>Police Station:</strong> {caseItem.policeStation}
    </p>
    <p>
      <strong>Status:</strong>
      <span className={`status-${caseItem.status.toLowerCase()}`}>
        {caseItem.status}
      </span>
    </p>
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/edit-case/${caseItem.id}`);
      }}
      className="edit-button"
    >
      Edit
    </button>
  </div>
);

export default GeneralUserDashboard;
