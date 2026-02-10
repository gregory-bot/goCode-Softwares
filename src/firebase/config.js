import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCbnsbYdQDuj_9pBWCeWBU1eXr8_-j8b4c",
  authDomain: "support-chat-3dab4.firebaseapp.com",
  databaseURL: "https://support-chat-3dab4-default-rtdb.firebaseio.com",
  projectId: "support-chat-3dab4",
  storageBucket: "support-chat-3dab4.firebasestorage.app",
  messagingSenderId: "906167021290",
  appId: "1:906167021290:web:83974728341973e732b193",
  measurementId: "G-JLT6LNFDZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;