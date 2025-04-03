import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ClipLoader, SomeSpinnerComponent } from 'react-spinners'; // For the loading spinner
import '../styles/Login.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch the user's role from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        // Redirect based on the user's role
        if (userRole === 'general_user') {
          navigate('/general-user-dashboard');
        } else if (userRole === 'police_officer') {
          navigate('/police-officer-dashboard');
        } else {
          setError('Unknown user role.');
        }
      } else {
        setError('User data not found.');
      }
    } catch (error) {
      // Handle specific errors
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        default:
          setError('An error occurred. Please try again.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container pt-20">
      <img
        src="https://i.postimg.cc/FH0rkXfF/IMG-20241205-WA0007.png"
        alt="App Logo"
        className="logo"
      />
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="button" disabled={loading}>
          {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Login'}
        </button>
      </form>
      <div className="signup-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate('/')}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
