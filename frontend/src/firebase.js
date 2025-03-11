// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDKeTl1eUvuefKxhNspRxw3nDo44hdc4Bo',
  authDomain: 'criminal-739f0.firebaseapp.com',
  projectId: 'criminal-739f0',
  storageBucket: 'criminal-739f0.firebasestorage.app',
  messagingSenderId: '458755874781',
  appId: '1:458755874781:web:d514e0f79a89b851d4e034',
  measurementId: 'G-86V6B1EVTY',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export default app;
