// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDKeTl1eUvuefKxhNspRxw3nDo44hdc4Bo',
  authDomain: 'criminal-739f0.firebaseapp.com',
  projectId: 'criminal-739f0',
  storageBucket: 'criminal-739f0.firebasestorage.app', // Storage bucket
  messagingSenderId: '458755874781',
  appId: '1:458755874781:web:d514e0f79a89b851d4e034',
  measurementId: 'G-86V6B1EVTY',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Function to fetch user role
const fetchUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid)); // Fetch user document
    if (userDoc.exists()) {
      return userDoc.data().role; // Return the user's role
    } else {
      throw new Error('User role not found');
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
};

// Exporting Firebase services and the fetchUserRole function
export { auth, db, storage, fetchUserRole }; // Export storage
export default app;
