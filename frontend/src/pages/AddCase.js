// src/components/AddCaseForm.js
import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase'; // Import auth, db, and storage from firebase.js
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AddCaseForm.css';

function AddCaseForm() {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    province: '',
    serviceName: '',
    officerName: '',
    employeeNumber: '',
    ranking: '',
  });
  const [caseNumber, setCaseNumber] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [protectionOrderDetails, setProtectionOrderDetails] = useState('');
  const [protectionOrderModalOpen, setProtectionOrderModalOpen] =
    useState(false);
  const [cases, setCases] = useState([]); // State to store fetched cases

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'province') {
      setSelectedProvince(value);
    }
  };

  // List of police stations for the dropdown
  const policeStationsByProvince = {
    Gauteng: [
      'Leeuhof Prison Hospital',
      'Johannesburg Correctional Service Centre',
      'Boksburg Correctional Service Centre',
    ],
    'KwaZulu-Natal': [
      'Durban Correctional Service Centre',
      'Westville Correctional Service Centre',
      'Pietermaritzburg Correctional Service Centre',
    ],
    'Western Cape': [
      'Pollsmoor Prison',
      'Goodwood Correctional Service Centre',
      'Brandvlei Correctional Service Centre',
    ],
    'Eastern Cape': [
      'East London Correctional Service Centre',
      'St. Albans Correctional Service Centre',
      'Mthatha Correctional Service Centre',
    ],
    'Free State': [
      'Grootvlei Prison',
      'Bethlehem Correctional Service Centre',
      'Kroonstad Correctional Service Centre',
    ],
    Limpopo: [
      'Polokwane Correctional Service Centre',
      'Thohoyandou Correctional Service Centre',
      'Modimolle Correctional Service Centre',
    ],
    Mpumalanga: [
      'Barberton Prison',
      'Nelspruit Correctional Service Centre',
      'Witbank Correctional Service Centre',
    ],
    'Northern Cape': [
      'Kimberley Correctional Service Centre',
      'Upington Correctional Service Centre',
      'Kuruman Correctional Service Centre',
    ],
    'North West': [
      'Rustenburg Correctional Service Centre',
      'Mafikeng Correctional Service Centre',
      'Potchefstroom Correctional Service Centre',
    ],
  };

  // Update services when province changes
  useEffect(() => {
    if (selectedProvince) {
      setServices(policeStationsByProvince[selectedProvince] || []);
    } else {
      setServices([]);
    }
  }, [selectedProvince]);

  // Fetch cases for the current user
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'cases'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const casesData = [];
      querySnapshot.forEach((doc) => {
        casesData.push({ id: doc.id, ...doc.data() });
      });
      setCases(casesData);
    });

    return () => unsubscribe();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('You must be logged in to add a case.');
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
        policeStation: formData.serviceName,
        status,
        description,
        userId: user.uid,
        documentUrl,
        protectionOrder: null,
        createdAt: new Date(),
      });

      toast.success('Case added successfully!');

      // Reset all form fields
      setFormData({
        province: '',
        serviceName: '',
        officerName: '',
        employeeNumber: '',
        ranking: '',
      });
      setSelectedProvince('');
      setServices([]);
      setCaseNumber('');
      setAssignedOfficer('');
      setStatus('');
      setDescription('');
      setDocumentFile(null);
    } catch (error) {
      console.error('Error adding case:', error);
      toast.error('Failed to add case.');
    }
  };

  // Handle protection order form submission
  const handleProtectionOrderSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be logged in to apply for a protection order.');
      return;
    }

    try {
      await addDoc(collection(db, 'protectionOrders'), {
        userId: user.uid,
        details: protectionOrderDetails,
        createdAt: new Date(),
      });

      toast.success('Protection Order applied successfully!');
      setProtectionOrderModalOpen(false);
      setProtectionOrderDetails('');
    } catch (error) {
      console.error('Error applying for protection order:', error);
      toast.error('Failed to apply for protection order.');
    }
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setProtectionOrderModalOpen(false);
    }
  };

  return (
    <div className="container">
      <ToastContainer />
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
        <h2>Correctional Service Information</h2>

        {/* Province Dropdown */}
        <label htmlFor="province">Province</label>
        <select
          id="province"
          name="province"
          value={formData.province}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>
            Select province
          </option>
          {Object.keys(policeStationsByProvince).map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>

        {/* Police Station Dropdown */}
        <label htmlFor="serviceName">Police Station Name</label>
        <select
          id="serviceName"
          name="serviceName"
          value={formData.serviceName}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>
            Select Police Station
          </option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
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

        {/* Incident Description */}
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
      </form>

      {/* Protection Order Modal with Backdrop */}
      {protectionOrderModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={handleBackdropClick}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
            }}
          >
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
        </div>
      )}
    </div>
  );
}

export default AddCaseForm;
