// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore'; // Import Firestore functions
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage

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

// Function to add a missing person
const addMissingPerson = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'missingPersons'), {
      ...data,
      reportedAt: new Date(), // Add a timestamp
    });
    console.log('Missing person added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding missing person:', error);
    throw error;
  }
};

// Function to fetch all missing persons
const fetchMissingPersons = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'missingPersons'));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error('Error fetching missing persons:', error);
    throw error;
  }
};

// Function to update a missing person
const updateMissingPerson = async (id, data) => {
  try {
    const docRef = doc(db, 'missingPersons', id);
    await updateDoc(docRef, data);
    console.log('Missing person updated successfully');
  } catch (error) {
    console.error('Error updating missing person:', error);
    throw error;
  }
};

// Function to delete a missing person
const deleteMissingPerson = async (id) => {
  try {
    await deleteDoc(doc(db, 'missingPersons', id));
    console.log('Missing person deleted successfully');
  } catch (error) {
    console.error('Error deleting missing person:', error);
    throw error;
  }
};

// Function to add a wanted person
const addWantedPerson = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'wantedPersons'), {
      ...data,
      reportedAt: new Date(), // Add a timestamp
    });
    console.log('Wanted person added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding wanted person:', error);
    throw error;
  }
};

// Function to fetch all wanted persons
const fetchWantedPersons = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'wantedPersons'));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error('Error fetching wanted persons:', error);
    throw error;
  }
};

// Function to update a wanted person
const updateWantedPerson = async (id, data) => {
  try {
    const docRef = doc(db, 'wantedPersons', id);
    await updateDoc(docRef, data);
    console.log('Wanted person updated successfully');
  } catch (error) {
    console.error('Error updating wanted person:', error);
    throw error;
  }
};

// Function to delete a wanted person
const deleteWantedPerson = async (id) => {
  try {
    await deleteDoc(doc(db, 'wantedPersons', id));
    console.log('Wanted person deleted successfully');
  } catch (error) {
    console.error('Error deleting wanted person:', error);
    throw error;
  }
};

// Function to upload a file (e.g., photo or document)
const uploadFile = async (file, path) => {
  try {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Exporting Firebase services and functions
export {
  auth,
  db,
  storage,
  fetchUserRole,
  addMissingPerson,
  fetchMissingPersons,
  updateMissingPerson,
  deleteMissingPerson,
  addWantedPerson,
  fetchWantedPersons,
  updateWantedPerson,
  deleteWantedPerson,
  uploadFile,
};
export default app;
