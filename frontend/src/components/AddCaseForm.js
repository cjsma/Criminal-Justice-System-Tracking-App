// src/components/AddCaseForm.js
import React, { useState } from 'react';
import { auth, db, storage } from '../firebase'; // Import auth, db, and storage from firebase.js
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function AddCaseForm() {
  const [caseNumber, setCaseNumber] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [policeStation, setPoliceStation] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [protectionOrderDetails, setProtectionOrderDetails] = useState('');
  const [protectionOrderModalOpen, setProtectionOrderModalOpen] =
    useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in to add a case.');
        return;
      }

      // Upload document to Firebase Storage if a file is selected
      let documentUrl = '';
      if (documentFile) {
        const fileRef = ref(
          storage,
          `documents/cases/${user.uid}/${documentFile.name}`
        );
        await uploadBytes(fileRef, documentFile);
        documentUrl = await getDownloadURL(fileRef);
      }

      // Add case data to Firestore
      await addDoc(collection(db, 'cases'), {
        caseNumber,
        assignedOfficer,
        policeStation,
        status,
        description,
        userId: user.uid,
        documentUrl, // Store document URL if uploaded
        protectionOrder: null, // No protection order yet
        createdAt: new Date(),
      });

      alert('Case added successfully!');
      setCaseNumber('');
      setAssignedOfficer('');
      setPoliceStation('');
      setStatus('');
      setDescription('');
      setDocumentFile(null);
    } catch (error) {
      console.error('Error adding case:', error);
      alert('Failed to add case');
    }
  };

  // Handle protection order form submission
  const handleProtectionOrderSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to apply for a protection order.');
      return;
    }

    try {
      // Here you can save the protection order request to Firestore
      await addDoc(collection(db, 'protectionOrders'), {
        userId: user.uid,
        details: protectionOrderDetails,
        createdAt: new Date(),
      });

      alert('Protection Order applied successfully!');
      setProtectionOrderModalOpen(false);
      setProtectionOrderDetails('');
    } catch (error) {
      console.error('Error applying for protection order:', error);
      alert('Failed to apply for protection order.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Case</h2>
      <label>
        Case Number:
        <input
          type="text"
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
          required
        />
      </label>
      <label>
        Assigned Officer:
        <input
          type="text"
          value={assignedOfficer}
          onChange={(e) => setAssignedOfficer(e.target.value)}
          required
        />
      </label>
      <label>
        Police Station:
        <input
          type="text"
          value={policeStation}
          onChange={(e) => setPoliceStation(e.target.value)}
          required
        />
      </label>
      <label>
        Status:
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="">Select Status</option>
          <option value="Under Investigation">Under Investigation</option>
          <option value="Bail">Bail</option>
          <option value="Acquitted">Acquitted</option>
        </select>
      </label>
      <label>
        Incident Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      {/* Document Upload */}
      <label>
        Upload Document (Optional):
        <input
          type="file"
          onChange={(e) => setDocumentFile(e.target.files[0])}
        />
      </label>

      <button type="submit">Add Case</button>

      {/* Protection Order Modal */}
      <button type="button" onClick={() => setProtectionOrderModalOpen(true)}>
        Apply for Protection Order
      </button>

      {protectionOrderModalOpen && (
        <div className="modal">
          <h2>Protection Order</h2>
          <textarea
            value={protectionOrderDetails}
            onChange={(e) => setProtectionOrderDetails(e.target.value)}
            placeholder="Enter details for the protection order"
            required
          />
          <button onClick={handleProtectionOrderSubmit}>
            Submit Protection Order
          </button>
          <button onClick={() => setProtectionOrderModalOpen(false)}>
            Close
          </button>
        </div>
      )}
    </form>
  );
}

export default AddCaseForm;
