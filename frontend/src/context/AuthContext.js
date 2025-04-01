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
  const [correctionalServiceAdded, setCorrectionalServiceAdded] =
    useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        try {
          // Fetch user role and correctional service status from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User Data:', userData); // Debug: Log user data
            console.log('User Role:', userData.role); // Debug: Log user role
            console.log(
              'Correctional Service Added:',
              userData.correctionalServiceAdded
            ); // Debug: Log status

            setRole(userData.role);
            setCorrectionalServiceAdded(
              userData.correctionalServiceAdded || false
            );
          } else {
            console.error('User document does not exist in Firestore'); // Debug: Log error
            setRole(null);
            setCorrectionalServiceAdded(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error); // Debug: Log error
          setRole(null);
          setCorrectionalServiceAdded(false);
        }
      } else {
        setCurrentUser(null); // No user logged in
        setRole(null);
        setCorrectionalServiceAdded(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    role,
    correctionalServiceAdded,
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

export { AuthContext };
