import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import '../styles/PoliceOfficerDashboard.css';

const PoliceOfficerDashboard = () => {
  const navigate = useNavigate();
  const [officerName, setOfficerName] = useState('');
  const [protectionOrderModalOpen, setProtectionOrderModalOpen] =
    useState(false);
  const [protectionOrderDetails, setProtectionOrderDetails] = useState('');
  const [submittingProtectionOrder, setSubmittingProtectionOrder] =
    useState(false);
  const [protectionOrderError, setProtectionOrderError] = useState(null);
  const [protectionOrderSuccess, setProtectionOrderSuccess] = useState(false);

  // Fetch officer name
  useEffect(() => {
    const fetchOfficerName = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setOfficerName(userData.name || 'Officer');
          } else {
            setOfficerName('Officer');
          }
        }
      } catch (err) {
        console.error('Failed to fetch officer info:', err);
        setOfficerName('Officer');
      }
    };

    fetchOfficerName();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setProtectionOrderModalOpen(false);
  };

  const handleProtectionOrderSubmit = async (e) => {
    e.preventDefault();
    if (!protectionOrderDetails.trim()) {
      setProtectionOrderError(
        'Please provide details for the protection order'
      );
      return;
    }

    setSubmittingProtectionOrder(true);
    setProtectionOrderError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      await addDoc(collection(db, 'protectionOrders'), {
        userId: user.uid,
        officerName: officerName,
        details: protectionOrderDetails,
        status: 'pending',
        createdAt: new Date(),
      });

      setProtectionOrderSuccess(true);
      setProtectionOrderDetails('');
      setTimeout(() => {
        setProtectionOrderModalOpen(false);
        setProtectionOrderSuccess(false);
      }, 2000);
    } catch (err) {
      setProtectionOrderError(
        'Failed to submit protection order. Please try again.'
      );
      console.error(err);
    } finally {
      setSubmittingProtectionOrder(false);
    }
  };

  return (
    <div className="police-dashboard">
      {/* Protection Order Modal */}
      {protectionOrderModalOpen && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="modal-content">
            <h2>Apply for Protection Order</h2>
            {protectionOrderSuccess ? (
              <div className="success-message">
                Protection order submitted successfully!
              </div>
            ) : (
              <form onSubmit={handleProtectionOrderSubmit}>
                <label htmlFor="protectionOrderDetails">
                  Provide details for the protection order:
                </label>
                <textarea
                  id="protectionOrderDetails"
                  value={protectionOrderDetails}
                  onChange={(e) => setProtectionOrderDetails(e.target.value)}
                  placeholder="Explain the situation requiring a protection order..."
                  required
                  rows={6}
                />
                {protectionOrderError && (
                  <div className="error-message">{protectionOrderError}</div>
                )}
                <div className="modal-buttons">
                  <button
                    type="button"
                    onClick={() => setProtectionOrderModalOpen(false)}
                    disabled={submittingProtectionOrder}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={submittingProtectionOrder}>
                    {submittingProtectionOrder ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Welcome,Policer {officerName}</h1>
      </div>

      {/* Action Buttons */}
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
          onClick={() => setProtectionOrderModalOpen(true)}
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
    </div>
  );
};

export default PoliceOfficerDashboard;
