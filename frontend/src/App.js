import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import GeneralUserDashboard from './pages/GeneralUserDashboard';
import PoliceOfficerDashboard from './pages/PoliceOfficerDashboard';
import Cases from './pages/Cases';
import WantedBases from './pages/WantedBases';
import MissingPerson from './pages/MissingPerson';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ReportMissingPerson from './pages/ReportMissingPerson';
import ListMissingPerson from './pages/ListMissingPerson';
import Header from './components/Header';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AddCase from './pages/AddCase';
import EditCase from './pages/EditCase';
import MissingPersonDetails from './pages/MissingPersonDetails';
import MostWanted from './pages/MostWanted'; // role-aware page
import AddMostWanted from './pages/AddMostWanted';
import ManageMostWanted from './pages/ManageMostWanted';
import ListMostWanted from './pages/ListMostWanted';
import ApplyProtectionForm from './pages/ApplyProtectionForm';
import AddDocumentPage from './components/AddDocumentPage';
import DocumentListViewer from './pages/DocumentListViewer';
// src/index.js or src/App.js
import '@fontsource/inter/300.css';       // Light weight
import '@fontsource/inter/400.css';       // Regular weight
import '@fontsource/inter/500.css';       // Medium weight
import '@fontsource/inter/600.css';       // Semi-bold weight
import '@fontsource/inter/700.css';       // Bold weight
import AnonymousTip from './pages/AnonymousTip';
import './App.css';

function AppContent() {
  const location = useLocation();
  const { role, correctionalServiceAdded } = useAuth();
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    // Normalize pathname (removes trailing slashes and lowers case)
    const currentPath = location.pathname.replace(/\/+$/, '').toLowerCase();
    const hiddenPaths = ['', '/signup', '/login'];
    setShowHeader(!hiddenPaths.includes(currentPath));
  }, [location.pathname]);

  const isLandingPage = location.pathname === '/';

  return (
    <div
      className={`App ${isLandingPage ? 'landing-layout' : 'default-layout'}`}
    >
      {showHeader && <Header />}

      <main className="content-wrapper">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/submit-tip" element={<AnonymousTip />} />

          {/* Protected Routes */}
          {!correctionalServiceAdded && role === 'police_officer' && (
            <Route
              path="/police-officer-dashboard"
              element={
                <ProtectedRoute allowedRoles={['police_officer']}>
                  <PoliceOfficerDashboard />
                </ProtectedRoute>
              }
            />
          )}

          <Route
            path="/general-user-dashboard"
            element={
              <ProtectedRoute allowedRoles={['general_user']}>
                <GeneralUserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cases"
            element={
              <ProtectedRoute allowedRoles={['police_officer']}>
                <Cases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wanted"
            element={
              <ProtectedRoute allowedRoles={['police_officer']}>
                <WantedBases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/missingPerson"
            element={
              <ProtectedRoute allowedRoles={['general_user', 'police_officer']}>
                <MissingPerson />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-case/:id"
            element={
              <ProtectedRoute allowedRoles={['general_user', 'police_officer']}>
                <EditCase />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-missing-person"
            element={<ReportMissingPerson />}
          />
          <Route path="/list-missing-persons" element={<ListMissingPerson />} />
          <Route
            path="/AddCase"
            element={
              <ProtectedRoute allowedRoles={['general_user', 'police_officer']}>
                <AddCase />
              </ProtectedRoute>
            }
          />

          <Route
            path="/apply-protection"
            element={
              <ProtectedRoute allowedRoles={['general_user', 'police_officer']}>
                <ApplyProtectionForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/missing-person/:id"
            element={<MissingPersonDetails />}
          />

          <Route
            path="/mostWanted"
            element={
              <ProtectedRoute allowedRoles={['general_user', 'police_officer']}>
                <MostWanted />
              </ProtectedRoute>
            }
          />

          <Route
            path="/list-most-wanted"
            element={
              <ProtectedRoute allowedRoles={['general_user', 'police_officer']}>
                <ListMostWanted />
              </ProtectedRoute>
            }
          />

          <Route path="/add-document" element={<AddDocumentPage />} />

          <Route
            path="/add-most-wanted"
            element={
              <ProtectedRoute allowedRoles={['police_officer']}>
                <AddMostWanted />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-most-wanted"
            element={
              <ProtectedRoute allowedRoles={['police_officer']}>
                <ManageMostWanted />
              </ProtectedRoute>
            }
          />

          <Route path="/document-list" element={<DocumentListViewer />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
