import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import '../styles/AddMostWanted.css';
import BackButton from '../components/BackButton';

const AddMostWanted = () => {
  const [formData, setFormData] = useState({
    name: '',
    crime: '',
    lastSeen: '',
    photoUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await addDoc(collection(db, 'mostWanted'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setSuccessMsg('Most Wanted individual added successfully!');
      setFormData({ name: '', crime: '', lastSeen: '', photoUrl: '' });
    } catch (error) {
      setErrorMsg('Error adding most wanted: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="general-user-dashboard">
      <header className="dashboard-header">
        <h1>Add Most Wanted Person</h1>
        <p>Help us track dangerous criminals</p>
      </header>

      {successMsg && <div className="success-message">{successMsg}</div>}
      {errorMsg && <div className="error-message">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="most-wanted-form">
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="most-wanted-input"
        />
        <input
          name="crime"
          placeholder="Crime Committed"
          value={formData.crime}
          onChange={handleChange}
          required
          className="most-wanted-input"
        />
        <input
          name="lastSeen"
          placeholder="Last Known Location"
          value={formData.lastSeen}
          onChange={handleChange}
          className="most-wanted-input"
        />
        <input
          name="photoUrl"
          placeholder="Photo URL (optional)"
          value={formData.photoUrl}
          onChange={handleChange}
          className="most-wanted-input"
        />

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add to Most Wanted'}
        </button>

       <BackButton/>
      </form>
    </div>
  );
};

export default AddMostWanted;
