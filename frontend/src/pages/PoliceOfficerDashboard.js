import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import '../styles/PoliceOfficerDashboard.css';
import { FilePlus, UserMinus, Shield, FileUp, Search, File } from "lucide-react";

const PoliceOfficerDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('No user is logged in.');
          setLoading(false);
          return;
        }

        // Fetch officer name
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.name || 'Officer');
        }

        // Fetch cases assigned to this officer using UID
        const casesQuery = query(
          collection(db, 'cases'),
          where('assignedOfficerId', '==', user.uid) // UID ensures correct assignment
        );
        const querySnapshot = await getDocs(casesQuery);
        const casesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCases(casesData);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch assigned cases. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOfficerData();
  }, []);

  return (
    <div className="correctional-service-page">
      <div className="form-container">
        <div className="general-user-dashboard">
           <header className="dashboard-header">
          <h1>Welcome, Officer {userName}!</h1>
        </header>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Dashboard Tiles Grid */}
          <div className="option-card-grid">
            <div className="option-card" onClick={() => navigate('/missingPerson')}>
               <UserMinus size={28} className="option-icon" />
              <h3>Report Missing Person</h3>
              <p>Submit and track missing persons reports.</p>
            </div>

            <div className="option-card" onClick={() => navigate('/addCase')}>
              <FilePlus size={28} className="option-icon" />
              <h3>Add New Case</h3>
              <p>Create a new criminal case record.</p>
            </div>

            <div className="option-card" onClick={() => navigate('/apply-protection')}>
              <Shield size={28} className="option-icon" />
              <h3>Apply for Protection Order</h3>
              <p>Start and manage protection order requests.</p>
            </div>

            <div className="option-card" onClick={() => navigate('/mostWanted')}>
              <Search size={28} className="option-icon" />
              <h3>Wanted by Law</h3>
              <p>View and update the most wanted list.</p>
            </div>
          </div>

          {/* Cases List */}
          {loading ? (
            <p>Loading assigned cases...</p>
          ) : cases.length === 0 ? (
            <p>No cases assigned to you yet.</p>
          ) : (
            <div className="cases-list">
              <h2>Your Assigned Cases</h2>
              <div className="cases-grid">
                {cases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="case-card"
                    onClick={() => navigate(`/case/${caseItem.id}`)}
                  >
                    <h3>Case Number: {caseItem.caseNumber}</h3>
                    <p><strong>Status:</strong> {caseItem.status}</p>
                    <p><strong>Police Station:</strong> {caseItem.policeStation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoliceOfficerDashboard;
