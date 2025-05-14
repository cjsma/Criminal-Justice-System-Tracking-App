import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AddMostWanted = () => {
  const [formData, setFormData] = useState({
    name: '',
    crime: '',
    lastSeen: '',
    photoUrl: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'mostWanted'), {
      ...formData,
      createdAt: serverTimestamp(),
    });
    alert('Most Wanted individual added!');
    setFormData({ name: '', crime: '', lastSeen: '', photoUrl: '' });
  };

  return (
    <div>
      <h2>Add Most Wanted Person</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="crime"
          placeholder="Crime"
          value={formData.crime}
          onChange={handleChange}
          required
        />
        <input
          name="lastSeen"
          placeholder="Last Seen Location"
          value={formData.lastSeen}
          onChange={handleChange}
        />
        <input
          name="photoUrl"
          placeholder="Photo URL"
          value={formData.photoUrl}
          onChange={handleChange}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddMostWanted;
