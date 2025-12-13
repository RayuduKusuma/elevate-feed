import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZzbsrYpJzZnU9_GTFy_X8T5IeJ-5mpQ8",
  authDomain: "instagram-9568c.firebaseapp.com",
  projectId: "instagram-9568c",
  storageBucket: "instagram-9568c.firebasestorage.app",
  messagingSenderId: "384801827390",
  appId: "1:384801827390:web:918a729b5a0a975c957f6f",
  measurementId: "G-QW2F31EQX5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
