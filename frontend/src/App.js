import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import WantedBases from './pages/WantedBases';
import MissingPerson from './pages/MissingPerson';

function App() {
  return (
    <AuthProvider>
      {' '}
      {/* Wrap the Router with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/wanted" element={<WantedBases />} />
          <Route path="/missingPerson" element={<MissingPerson />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
