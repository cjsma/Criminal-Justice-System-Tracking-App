// firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyDKeTl1eUvuefKxhNspRxw3nDo44hdc4Bo',
  authDomain: 'criminal-739f0.firebaseapp.com',
  projectId: 'criminal-739f0',
  storageBucket: 'criminal-739f0.appspot.com',
  messagingSenderId: '458755874781',
  appId: '1:458755874781:web:d514e0f79a89b851d4e034',
  measurementId: 'G-86V6B1EVTY'
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Add anonymous tip function
const submitAnonymousTip = async (tipData) => {
  try {
    const docRef = await addDoc(collection(db, 'anonymous_tips'), {
      ...tipData,
      createdAt: serverTimestamp(),
      status: 'submitted'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting tip:', error);
    throw error;
  }
};

export {
  auth,
  db,
  storage,
  functions,
  submitAnonymousTip,
  // ... other existing exports
};