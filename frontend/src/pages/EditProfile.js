import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css';
import BackButton from '../components/BackButton';


function EditProfile() {
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
   

  // Load current profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (auth.currentUser) {
          setName(auth.currentUser.displayName || '');
          setPhotoURL(auth.currentUser.photoURL || '');

          // Try to get additional data from Firestore
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setName(userData.name || auth.currentUser.displayName || '');
            setPhotoURL(userData.photoURL || auth.currentUser.photoURL || '');
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!auth.currentUser) {
      setError('No user logged in');
      return;
    }

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL || null, // Set to null if empty to remove photo
      });

      // Update Firestore profile
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        name: name,
        photoURL: photoURL || null,
        lastUpdated: new Date(),
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="edit-profile-page">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <h1>Edit Profile</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Display Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength="2"
            maxLength="50"
          />
        </div>

        <div className="form-group">
          <label htmlFor="photoURL">Profile Photo URL</label>
          <input
            id="photoURL"
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            pattern="https?://.+"
            title="Please enter a valid URL starting with http:// or https://"
          />
          {photoURL && (
            <div className="photo-preview">
              <p>Photo Preview:</p>
              <img
                src={photoURL}
                alt="Profile preview"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          type="button"
          className="cancel-button"
          onClick={() => navigate('/profile')}
        >
          Cancel
        </button>
       <BackButton/>
      </form>
    </div>
  );
}

export default EditProfile;
