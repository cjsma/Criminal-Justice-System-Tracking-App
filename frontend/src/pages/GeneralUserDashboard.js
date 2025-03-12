import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AddCaseForm from '../components/AddCaseForm'; // Import the AddCaseForm component
import "./PoliceOfficerDashboard.css"; // Import the CSS file

function GeneralUserDashboard() {
  const [cases, setCases] = useState([]);
  const [showAddCaseForm, setShowAddCaseForm] = useState(false);

  // Fetch cases for the logged-in user
  useEffect(() => {
    const fetchCases = async () => {
      const user = auth.currentUser;
      if (user) {
        const casesQuery = query(
          collection(db, 'cases'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(casesQuery);
        const casesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCases(casesData);
      }
    };

    fetchCases();
  }, []);

  return (
    <div className="general-user-dashboard">
      <h1>General User Dashboard</h1>

      {/* Button to show the Add Case form */}
      <button onClick={() => setShowAddCaseForm(!showAddCaseForm)}>
        {showAddCaseForm ? 'Cancel' : 'Add New Case'}
      </button>

      {/* Render the AddCaseForm if showAddCaseForm is true */}
      {showAddCaseForm && <AddCaseForm />}

      {/* List of Cases */}
      <div className="cases-list">
        <h2>Your Cases</h2>
        {cases.length === 0 ? (
          <p>No cases found.</p>
        ) : (
          cases.map((caseItem) => (
            <div key={caseItem.id} className="case-item">
              <h3>Case Number: {caseItem.caseNumber}</h3>
              <p>Assigned Officer: {caseItem.assignedOfficer}</p>
              <p>Police Station: {caseItem.policeStation}</p>
              <p>Status: {caseItem.status}</p>
              <p>Incident Description: {caseItem.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GeneralUserDashboard;
