import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import '../styles/AddMostWanted.css'; // Create this CSS file

const AddMostWanted = () => {
  const [formData, setFormData] = useState({
    name: '',
    crime: '',
    lastSeen: '',
    photoUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'mostWanted'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      alert('Most Wanted individual added successfully!');
      setFormData({ name: '', crime: '', lastSeen: '', photoUrl: '' });
    } catch (error) {
      alert('Error adding most wanted: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="most-wanted-container">
      <div className="most-wanted-card floating">
        <h2 className="most-wanted-title">Add Most Wanted Person</h2>
        <p className="most-wanted-subtitle">Help us track dangerous criminals</p>
        
        <form onSubmit={handleSubmit} className="most-wanted-form">
          <div className="form-group">
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="most-wanted-input"
            />
            <span className="input-highlight"></span>
          </div>
          
          <div className="form-group">
            <input
              name="crime"
              placeholder="Crime Committed"
              value={formData.crime}
              onChange={handleChange}
              required
              className="most-wanted-input"
            />
            <span className="input-highlight"></span>
          </div>
          
          <div className="form-group">
            <input
              name="lastSeen"
              placeholder="Last Known Location"
              value={formData.lastSeen}
              onChange={handleChange}
              className="most-wanted-input"
            />
            <span className="input-highlight"></span>
          </div>
          
          <div className="form-group">
            <input
              name="photoUrl"
              placeholder="Photo URL (optional)"
              value={formData.photoUrl}
              onChange={handleChange}
              className="most-wanted-input"
            />
            <span className="input-highlight"></span>
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add to Most Wanted'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMostWanted;