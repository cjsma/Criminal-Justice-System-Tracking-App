import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/GeneralDashboard.css';
import { FilePlus, UserMinus, Shield, FileUp, Search, File } from "lucide-react";

function GeneralUserDashboard() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [userName, setUserName] = useState(''); // Stores logged-in user's name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user info and cases
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Fetch user name from Firestore
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserName(userData.name || 'User'); // fallback to "User"
          }

          // Fetch cases for this user
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
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        <h2>Welcome, {userName}!</h2>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Dashboard Options */}
      <div className="action-options">
        <div onClick={() => navigate('/casesPage')} className="option-card">
          <FilePlus size={28} className="option-icon" />
          <h3>Your Cases</h3>
           <p>View all cases you have submitted or are involved in.</p>
          <h3 className="case-count-badge">{cases.length}</h3>
        </div>

        <div onClick={() => navigate('/missingPerson')} className="option-card">
          <UserMinus size={28} className="option-icon" />
          <h3>Report Missing Person</h3>
          <p>Submit and track missing persons reports.</p>
        </div>

        <div onClick={() => navigate('/addCase')} className="option-card">
          <FilePlus size={28} className="option-icon" />
          <h3>Add New Case</h3>
          <p>Create a new criminal case record.</p>
        </div>

        <div onClick={() => navigate('/apply-protection')} className="option-card">
          <Shield size={28} className="option-icon" />
          <h3>Apply for Protection Order</h3>
          <p>Start and manage protection order requests.</p>
        </div>

        <div onClick={() => navigate('/mostWanted')} className="option-card">
          <Search size={28} className="option-icon" />
          <h3>Wanted by Law</h3>
          <p>View the most wanted list.</p>
        </div>

        <div onClick={() => navigate('/add-document')} className="option-card">
          <FileUp size={28} className="option-icon" />
          <h3>Upload Documents</h3>
           <p>Submit documents related to your cases.</p>
        </div>

        <div onClick={() => navigate('/document-list')} className="option-card">
          <File size={28} className="option-icon" />
          <h3>View Documents</h3>
          <p>Access all your uploaded case documents.</p>
        </div>
      </div>

    </div>
  );
}


// ========== Protection Order Modal ==========
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

export default GeneralUserDashboard;
