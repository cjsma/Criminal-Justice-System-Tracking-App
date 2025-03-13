import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase'; // Import Firestore and Storage
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Storage functions
import '../styles/ReportMissingPerson.css'; // Import the new CSS file

const ReportMissingPerson = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    lastSeen: '',
    incidentDescription: '',
    description: '',
    photo: null,
    documents: [],
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file uploads (photo or documents)
  const handleFileUpload = async (file, path) => {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload photo if provided
      let photoUrl = '';
      if (formData.photo) {
        photoUrl = await handleFileUpload(
          formData.photo,
          `photos/${formData.photo.name}`
        );
      }

      // Upload documents if provided
      const documentUrls = [];
      if (formData.documents.length > 0) {
        for (const file of formData.documents) {
          const url = await handleFileUpload(file, `documents/${file.name}`);
          documentUrls.push(url);
        }
      }

      // Add the missing person report to Firestore
      const docRef = await addDoc(collection(db, 'missingPersons'), {
        name: formData.name,
        age: formData.age,
        lastSeen: formData.lastSeen,
        incidentDescription: formData.incidentDescription,
        description: formData.description,
        photoUrl: photoUrl || null, // Store photo URL or null if no photo
        documentUrls: documentUrls.length > 0 ? documentUrls : null, // Store document URLs or null if no documents
        reportedAt: new Date(), // Add a timestamp
      });

      console.log('Missing person report submitted with ID:', docRef.id);
      navigate('/list-missing-persons'); // Navigate to the list page
    } catch (error) {
      console.error('Error submitting missing person report:', error);
      setError('Failed to submit the report. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="report-missing-person-container">
      <h1>Report a Missing Person</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastSeen"
          placeholder="Last Seen Location"
          value={formData.lastSeen}
          onChange={handleChange}
          required
        />
        <textarea
          name="incidentDescription"
          placeholder="Incident Description"
          value={formData.incidentDescription}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Additional Description"
          value={formData.description}
          onChange={handleChange}
        />
        <div>
          <label>Add Photo (Optional):</label>
          <input
            type="file"
            name="photo"
            onChange={(e) =>
              setFormData({ ...formData, photo: e.target.files[0] })
            }
            accept="image/*"
          />
        </div>
        <div>
          <label>Add Documents (Optional):</label>
          <input
            type="file"
            name="documents"
            multiple
            onChange={(e) =>
              setFormData({ ...formData, documents: [...e.target.files] })
            }
          />
        </div>
        <button type="submit" disabled={uploading}>
          {uploading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportMissingPerson;
