import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import ReportMissingPerson from './pages/ReportMissingPerson';
import ListMissingPerson from './pages/ListMissingPerson';
import Header from './components/Header';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

function AppContent() {
  const location = useLocation();
  const hideHeaderRoutes = ['/profile', '/edit-profile']; // Hide header on these routes

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
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
        <Route
          path="/report-missing-person"
          element={<ReportMissingPerson />}
        />
        <Route path="/list-missing-persons" element={<ListMissingPerson />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
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
