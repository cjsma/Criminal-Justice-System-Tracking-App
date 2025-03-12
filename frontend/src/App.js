// src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/police-officer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['police_officer']}>
                <PoliceOfficerDashboard />
              </ProtectedRoute>
            }
          />
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

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
