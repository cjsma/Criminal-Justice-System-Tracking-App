import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import '../styles/PoliceOfficerDashboard.css';

const PoliceOfficerDashboard = () => {
  const navigate = useNavigate();
  const [protectionOrderModalOpen, setProtectionOrderModalOpen] = useState(false);
  const [protectionOrderDetails, setProtectionOrderDetails] = useState('');
  const [submittingProtectionOrder, setSubmittingProtectionOrder] = useState(false);
  const [protectionOrderError, setProtectionOrderError] = useState(null);
  const [protectionOrderSuccess, setProtectionOrderSuccess] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setProtectionOrderModalOpen(false);
    }
  };

  const handleProtectionOrderSubmit = async (e) => {
    e.preventDefault();
    if (!protectionOrderDetails.trim()) {
      setProtectionOrderError('Please provide details for the protection order');
      return;
    }

    setSubmittingProtectionOrder(true);
    setProtectionOrderError(null);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      await addDoc(collection(db, 'protectionOrders'), {
        userId: user.uid,
        officerName: user.displayName || 'Anonymous Officer',
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
      setProtectionOrderError('Failed to submit protection order. Please try again.');
      console.error('Protection order submission error:', err);
    } finally {
      setSubmittingProtectionOrder(false);
    }
  };

  return (
    <div className="correctional-service-page">
      {protectionOrderModalOpen && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="modal-content">
            <h2>Apply for Protection Order</h2>
            {protectionOrderSuccess ? (
              <div className="success-message">
                Protection order submitted successfully!
              </div>
            ) : (
              <>
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
                    <button
                      type="submit"
                      disabled={submittingProtectionOrder}
                    >
                      {submittingProtectionOrder ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <div className="form-container">
        <div className="logo-container">
          <img
            className="logo"
            src="https://i.postimg.cc/FH0rkXfF/IMG-20241205-WA0007.png"
            alt="Logo"
          />
        </div>
        <h1>Correctional Service Information</h1>

        <div className="action-buttons">
          <button
            onClick={() => navigate('/missingPerson')}
            className="action-button"
          >
            Report Missing Person
          </button>
          <button
            onClick={() => navigate('/addCase')}
            className="action-button"
          >
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
    </div>
  );
};

export default PoliceOfficerDashboard;