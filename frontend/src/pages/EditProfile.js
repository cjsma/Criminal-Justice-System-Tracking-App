import React, { useState } from 'react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css';

function EditProfile() {
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });

      // Update Firestore profile
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        name: name,
        photoURL: photoURL,
      });

      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="edit-profile-page">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Profile Photo URL"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfile;
