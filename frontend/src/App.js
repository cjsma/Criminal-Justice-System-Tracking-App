import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
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
import './App.css';
import AddCase from './pages/AddCase';

function AppContent() {
  const location = useLocation();
  const { role, correctionalServiceAdded } = useAuth(); // Access role & correctionalServiceAdded state
  const hideHeaderRoutes = ['/', '/login', '/signup']; // Include the signup page in this list
  const isLandingPage = location.pathname === '/';

  return (
    <div
      className={`App ${isLandingPage ? 'landing-layout' : 'default-layout'}`}
    >
      {/* Conditionally render Header */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

      <main className="content-wrapper">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          {/* Protected Routes */}
          {/* Hide Police Officer Dashboard if correctional service info is added */}
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
