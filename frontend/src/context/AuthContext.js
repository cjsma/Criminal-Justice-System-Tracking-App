// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Create the AuthContext
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Fetch user role from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User Data:', userData); // Debug: Log user data
          console.log('User Role:', userData.role); // Debug: Log user role
          setRole(userData.role); // Set the role from Firestore
        } else {
          console.error('User document does not exist in Firestore'); // Debug: Log error
          setRole(null);
        }
      } else {
        setCurrentUser(null); // No user logged in
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    role,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Export the AuthContext and useAuth hook
export function useAuth() {
  return useContext(AuthContext);
}

// Export AuthContext explicitly
export { AuthContext };
