import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/EditCase.css';

function EditCase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const caseRef = doc(db, 'cases', id);
        const caseSnap = await getDoc(caseRef);
        if (caseSnap.exists()) {
          setCaseData(caseSnap.data());
          setUpdatedData(caseSnap.data());
        } else {
          setError('Case not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch case');
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const caseRef = doc(db, 'cases', id);
      await updateDoc(caseRef, updatedData);
      setSuccess('Case updated successfully!');
      setTimeout(() => navigate('/general-user-dashboard'), 1500);
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update case');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading case data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="edit-case-container">
      <div className="edit-case-header">
        <h2>Edit Case</h2>
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={updatedData.description || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            name="status"
            id="status"
            value={updatedData.status || ''}
            onChange={handleChange}
          >
            <option value="">Select status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            Update Case
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCase;
